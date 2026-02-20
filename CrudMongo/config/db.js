const mongoose=require('mongoose');
const conectarbd=async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/crud_node');
        console.log('mongo conectado');
    } catch (error) {
        console.error('error de conexion',error);
        process.exit(1);
    }
};
module.exports=conectarbd;