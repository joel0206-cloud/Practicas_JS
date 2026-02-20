const express=require('express');
const app=express();
const puerto=3000;
app.get('/',(req,res)=>{
    res.send('Joel Francisco Hernandez, ISC, 23 años');
});
app.listen(puerto,()=>{
    console.log(`servidor corriendo en http://localhost:${puerto}`)
});