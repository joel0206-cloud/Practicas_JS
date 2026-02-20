const mongoose=require('mongoose');
const UsuarioSchema=mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    correo:{
        type:String,
        required:true,
        unique:true
    },
    edad:{
        type:Number

    },
    fecharegistro:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Usuario', UsuarioSchema);