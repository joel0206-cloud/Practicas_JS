const express=require('express');
const conectarbd=require('./config/db');
const cors=require('cors');
const app=express();
conectarbd();
app.use(cors());
app.use(express.json());
app.use('/api/usuarios',require('./routers/usuarios'));
const puerto=3000;
app.listen(puerto,()=>{
    console.log('servidor corriendo en http://localhost:${puerto}');
});
