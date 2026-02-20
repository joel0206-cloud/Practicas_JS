/* ================================
   INICIO APP
================================ */
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
  console.log('window.educacionApp:', window.educacionApp);

  if (!window.educacionApp) {
    console.error('educacionApp NO disponible');
    return;
  }

  await cargarTutores();
  await cargarEstudiantes();
  await cargarTutoresParaSelect();

  setupEventListeners();
  setupModalForm();
}

/* ================================
   EVENTOS GENERALES
================================ */
function setupEventListeners() {
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.tab;

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      e.currentTarget.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // Forms
  document.getElementById('formTutor')
    ?.addEventListener('submit', handleCreateTutor);

  document.getElementById('formEstudiante')
    ?.addEventListener('submit', handleCreateEstudiante);
}

/* ================================
   CARGAR TUTORES
================================ */
async function cargarTutores() {
  const lista = document.getElementById('listaTutores');
  const total = document.getElementById('totalTutores');

  lista.className = 'loading';
  lista.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';

  try {
    const tutores = await window.educacionApp.getTutores();

    lista.innerHTML = tutores.map(tutor => `
      <div class="tutor-item">
        <div class="tutor-info">
          <h3>${tutor.nombre}</h3>
          <p><i class="fas fa-envelope"></i> ${tutor.email}</p>
          <p><i class="fas fa-calendar"></i>
            ${new Date(tutor.created_at).toLocaleDateString('es-MX')}
          </p>
        </div>

        <button class="delete-btn"
            onclick="eliminarTutor(${tutor.id}, '${tutor.nombre}')"
            title="Eliminar ${tutor.nombre}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        
      </div>
    `).join('');

    total.textContent = tutores.length || 0;

  } catch (error) {
    console.error('ERROR TUTORES:', error);
    lista.innerHTML = '<div class="error">Error conectando backend</div>';
  }
}

/* ================================
   CARGAR ESTUDIANTES
================================ */
async function cargarEstudiantes() {
  const lista = document.getElementById('listaEstudiantes');
  const total = document.getElementById('totalEstudiantes');

  lista.className = 'loading';
  lista.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Cargando estudiantes...';

  try {
    const estudiantes = await window.educacionApp.getEstudiantes();

    lista.innerHTML = estudiantes.map(est => {

      const nombreSeguro =
        encodeURIComponent(est.nombre);

      const calificacionTexto =
        (est.calificacion !== null &&
         est.calificacion !== undefined)
          ? est.calificacion
          : 'Sin calificar';

      return `
        <div class="estudiante-item">
          <div class="estudiante-info">
            <h3>${est.nombre}</h3>

            ${
              est.tutor_nombre
                ? `<p>
                     <i class="fas fa-chalkboard-teacher"></i>
                     Tutor: ${est.tutor_nombre}
                   </p>`
                : `<p>
                     <i class="fas fa-user-slash"></i>
                     Sin tutor
                   </p>`
            }

            <p>
              <i class="fas fa-star"
                 style="color:${est.calificacion >= 7 ? '#ffc107' : '#dc3545'}">
              </i>
              Calificación:
              <strong>${calificacionTexto}</strong>
            </p>
          </div>

          <button class="btn-edit"
            onclick="abrirModalEditar(
              ${est.id},
              decodeURIComponent('${nombreSeguro}'),
              ${est.tutor_id ?? 'null'},
              ${est.calificacion ?? 'null'}
            )">
            <i class="fas fa-edit"></i> Editar
          </button>
        </div>
      `;
    }).join('');

    total.textContent = estudiantes.length || 0;

  } catch (error) {
    console.error('ERROR ESTUDIANTES:', error);
    lista.innerHTML =
      '<div class="error">Error cargando estudiantes</div>';
  }
}

/* ================================
   SELECT TUTORES
================================ */
async function cargarTutoresParaSelect() {
  try {
    const tutores = await window.educacionApp.getTutores();
    const select = document.getElementById('tutorSelect');

    if (!select) return;

    select.innerHTML =
      '<option value="">Seleccionar tutor</option>' +
      tutores.map(t =>
        `<option value="${t.id}">${t.nombre}</option>`
      ).join('');

  } catch (error) {
    console.error('ERROR SELECT:', error);
  }
}

/* ================================
   CREAR TUTOR
================================ */
async function handleCreateTutor(e) {
  e.preventDefault();

  const nombre =
    document.getElementById('nombreTutor').value;

  const email =
    document.getElementById('emailTutor').value;

  try {
    await window.educacionApp.createTutor({ nombre, email });

    document.getElementById('formTutor').reset();

    await cargarTutores();
    await cargarTutoresParaSelect();

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

/* ================================
   CREAR ESTUDIANTE
================================ */
async function handleCreateEstudiante(e) {
  e.preventDefault();

  const nombre =
    document.getElementById('nombreEstudiante').value;

  const tutorId =
    document.getElementById('tutorSelect').value;

  if (!tutorId) {
    alert('Selecciona un tutor');
    return;
  }

  try {
    await window.educacionApp.createEstudiante({
      nombre,
      tutor_id: tutorId
    });

    document.getElementById('formEstudiante').reset();

    await cargarEstudiantes();

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

/* ================================
   ELIMINAR TUTOR
================================ */
// ✅  Modal de confirmación PERSONALIZADO
function mostrarConfirmacion(titulo, mensaje, callback) {
  // Crear modal temporal
  const modalConfirm = document.createElement('div');
  modalConfirm.id = 'modalConfirm';
  modalConfirm.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
  `;
  
  modalConfirm.innerHTML = `
    <div style="
      background: white;
      border-radius: 15px;
      padding: 30px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    ">
      <h3 style="color: #333; margin-bottom: 15px;">${titulo}</h3>
      <p style="color: #666; margin-bottom: 25px; font-size: 16px;">${mensaje}</p>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="btnConfirmSi" style="
          background: #e74c3c;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">Sí, Eliminar</button>
        <button id="btnConfirmNo" style="
          background: #f8f9fa;
          color: #666;
          border: 2px solid #dee2e6;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">Cancelar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalConfirm);
  
  // Event listeners
  document.getElementById('btnConfirmSi').onclick = () => {
    document.body.removeChild(modalConfirm);
    callback(true);
  };
  
  document.getElementById('btnConfirmNo').onclick = () => {
    document.body.removeChild(modalConfirm);
    callback(false);
  };
}

// ✅ FUNCIÓN ELIMINAR TUTOR CORREGIDA
window.eliminarTutor = async function(id, nombre) {
  mostrarConfirmacion(
    'Eliminar Tutor',
    `¿Estás seguro de eliminar a <strong>${nombre}</strong>?`,
    async (confirmado) => {
      if (confirmado) {
        try {
         // console.log('🔄 DELETE → http://localhost:3000/api/tutores/' + id);
          
          const response = await fetch(`http://localhost:3000/api/tutores/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });

          //console.log('📡 Status:', response.status);

          // Manejar tu respuesta exacta
          const result = await response.text();
          let data = { success: response.ok };
          
          if (result) {
            try {
              data = { ...data, ...JSON.parse(result) };
            } catch {
              data.message = result;
            }
          }

          if (response.ok || data.success !== false) {
            console.log('✅ Eliminado:', data.message);
            await cargarTutores();
            await cargarTutoresParaSelect();
          } else {
            alert(`❌ ${data.message || 'Error desconocido'}`);
          }

        } catch (error) {
          console.error('🔴 Error:', error);
          alert('🔌 Backend no disponible\n• `cd backend && npm start`\n• http://localhost:3000/api/tutores');
        }
      }
    }
  );
};

/*window.eliminarTutor = async function(id, nombre) {
  mostrarConfirmacion(
    'Eliminar Tutor',
    `¿Estás seguro de eliminar a <strong>${nombre}</strong>?`,
    async (confirmado) => {
      if (confirmado) {
        try {
          console.log('🔄 Enviando DELETE a:', `http://localhost:3000/api/tutores/${id}`);
          
          const response = await fetch(`http://localhost:3000/api/tutores/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('📡 Response status:', response.status, response.statusText);
          console.log('📡 Response headers:', [...response.headers.entries()]);

          // ✅ VERIFICAR si hay body ANTES de parsear JSON
          const responseText = await response.text();
          console.log('📄 Response raw:', responseText);

          let result;
          try {
            result = JSON.parse(responseText);
          } catch {
            // Si NO es JSON válido, considerar éxito si status 200
            if (response.ok) {
              result = { success: true, message: 'Eliminado correctamente' };
            } else {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          }

          if (result.success !== false) {
            console.log('✅ Tutor eliminado exitosamente');
            await cargarTutores();
            await cargarTutoresParaSelect();
            // Si tienes función stats
            if (typeof actualizarStats === 'function') actualizarStats();
          } else {
            alert(`❌ Error: ${result.error || result.message || 'Respuesta inválida del servidor'}`);
          }

        } catch (error) {
          console.error('🔴 Error completo:', error);
          // ✅ MENSAJE MÁS ESPECÍFICO
          if (error.message.includes('Failed to fetch')) {
            alert('🔌 Backend NO disponible:\n\n1. `cd backend && npm start`\n2. Verifica http://localhost:3000/api/tutores\n3. Revisa consola backend');
          } else {
            alert(`❌ Error: ${error.message}`);
          }
        }
      }
    }
  );
};
*/
/*window.eliminarTutor = async function(id, nombre) {
  mostrarConfirmacion(
    'Eliminar Tutor',
    `¿Estás seguro de eliminar a <strong>${nombre}</strong>?`,
    async (confirmado) => {
      if (confirmado) {
        try {
          // 🔥 CORRECCIÓN: URL COMPLETA del backend
          const response = await fetch(`http://localhost:3000/api/tutores/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();
          
          if (response.ok) {
            console.log('✅ Tutor eliminado');
            await cargarTutores();
            await cargarTutoresParaSelect();
            actualizarStats?.(); // Si existe
          } else {
            alert(`Error: ${result.error || 'No se pudo eliminar'}`);
          }
        } catch (error) {
          console.error('🔴 Error:', error);
         // alert('❌ Backend no disponible\n\n1. Inicia backend: `npm start`\n2. Verifica puerto 3000\n3. http://localhost:3000/api/tutores');
        }
      }
    }
  );
};*/

//window.eliminarTutor = eliminarTutor;
// ✅ FUNCIÓN ELIMINAR ESTUDIANTE (igual)
window.eliminarEstudiante = async function(id, nombre) {
  mostrarConfirmacion(
    'Eliminar Estudiante',
    `¿Estás seguro de eliminar a <strong>${nombre}</strong>?`,
    async (confirmado) => {
      if (confirmado) {
        try {
          await window.educacionApp.eliminarEstudiante(id);
          cargarEstudiantes();
          actualizarStats();
        } catch (error) {
          console.error('Error eliminando estudiante:', error);
          alert('Error al eliminar estudiante');
        }
      }
    }
  );
};


/*async function eliminarTutor(id) {
  if (!confirm('¿Eliminar tutor?')) return;

  try {
    await window.educacionApp.deleteTutor(id);

    await cargarTutores();
    await cargarEstudiantes();
    await cargarTutoresParaSelect();

  } catch (error) {
    alert('Error eliminando');
  }
}

window.eliminarTutor = eliminarTutor;*/

/* ================================
   MODAL EDITAR
================================ */
let modalAbierto = false;
let cacheTutores = [];

function getEl(id) {
  return document.getElementById(id);
}

window.abrirModalEditar = async function(id, nombre, tutor_id, calificacion) {
  if (modalAbierto) return;
  modalAbierto = true;

  // Reset y llenar
  getEl('formEditarEstudiante').reset();
  getEl('editarId').value = id;
  getEl('editarNombre').value = nombre;
  getEl('editarCalificacion').value = calificacion || '';

  try {
    // Cache inteligente
    let tutores = cacheTutores.length ? cacheTutores : await window.educacionApp.getTutores();
    cacheTutores = tutores;

    const select = getEl('editarTutor');
    select.innerHTML = '<option value="">Seleccionar tutor</option>';

    tutores.forEach(t => {
      const option = document.createElement('option');
      option.value = t.id;
      option.textContent = t.nombre;
      if (t.id == tutor_id) {
        option.selected = true;
        select.value = t.id; // Doble seguridad
      }
      select.appendChild(option);
    });
  } catch (e) {
    console.error('Error tutores:', e);
  }

  // Mostrar + focus
  getEl('modalEditar').style.display = 'flex';
  getEl('editarNombre').focus();
};


/* ================================
   SUBMIT EDITAR
================================ */
function setupModalForm() {
  const formEditar =
    document.getElementById('formEditarEstudiante');

  if (!formEditar) return;

  formEditar.onsubmit = async function(e) {
    e.preventDefault();

    const submitBtn =
      formEditar.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
      const id =
        document.getElementById('editarId').value;

      const nombre =
        document.getElementById('editarNombre').value;

      const tutorId =
        document.getElementById('editarTutor').value || null;

      const calificacion =
        document.getElementById('editarCalificacion').value || null;

      if (calificacion !== null &&
          (calificacion < 0 || calificacion > 10)) {
        alert('Calificación debe ser 0–10');
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/estudiantes/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            tutor_id: tutorId,
            calificacion
          })
        }
      );

      if (!response.ok)
        throw new Error('Error servidor');

      await cargarEstudiantes();
      cerrarModal();

    } catch (error) {
      alert('Error: ' + error.message);
    }
    finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-save"></i> Guardar Cambios';

      modalAbierto = false;
    }
  };
}

/* ================================
   CERRAR MODAL
================================ */
window.cerrarModal = function() {
  document.getElementById('modalEditar').style.display = 'none';
  modalAbierto = false;
};

/* ESC / CLICK FUERA */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalAbierto)
    cerrarModal();
});

document.getElementById('modalEditar')
  ?.addEventListener('click', e => {
    if (e.target.id === 'modalEditar')
      cerrarModal();
  });
