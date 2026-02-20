const http=require('http')
const servidor=http.createServer((req, res)=>{
res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
res.end('Hola Mundo desde el servidor NodeJs Basico en http://localhost:3000');

})
const puerto=3000;
servidor.listen(puerto,()=>{
    console.log(`servidor corriendo en http://localhost:${puerto}`)
});