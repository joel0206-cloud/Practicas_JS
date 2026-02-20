const express=require('express');
const router=express.Router();
const Usuario=require('../models/usuario');
//creacion del index o modelo a utilizar
router.get('/',async(req,res)=>{
    const usuarios=await Usuario.find();
    res.json(usuarios);
});
//creacion de usuario
router.post('/',async(req,res)=>{
    try {
        const usuario=new Usuario(req.body);
        await usuario.save();
        res.status(201).json(usuario); 
    } catch (error) {
        res.status(400).json({mensaje:error.message});
    }
});
module.exports=router;