//1 Definir el router... CRUD
//router: POST,GET,DELETE,UPDATE

const userRouter = require('express').Router()
//conectar al modelo (pero primero debemos crearlo)
//esto esta pendiente
const user = require('../models/usuario')

//2. registro del nombre que el usuario ingreso en el formulario
userRouter.post('/',(request,response)=>{
    //cuando ingrese a este metodo es porque lo estoy llamando desde el js del front, relacionado al formulario
    //donde quiero realizar el registro
    const {nombre} = request.body;
    //console.log(nombre) //este console log va a aparecer en la terminal, no en el navegador
    //console.log(!nombre)
    //validaciones a nivel de backend
    if(!nombre){
        //al realizar esta validacion retorno al frontend que hay un error
        console.log('Campos vacios')
        return response.status(400).json({error:'todos los campos son obligatorios'})
    }else{
        //caso en que esta correcto el dato a registrar
        //luego nos toca enviarlos a la BD
        console.log(nombre)
        //enviar los datos a la BD
        let usuario = new user()
        usuario.nombre = nombre

        async function guardarUsuario(){
            await usuario.save(); //Guardo en la bd
            const usuarioConsulta = await user.find()
            console.log('test ', usuarioConsulta)
        }
        guardarUsuario().catch(console.error)

        return response.status(200).json({mensaje: 'Se ha creado el usuario'})
    }

})

//userRouter.get()

//userRouter.delete()

module.exports = userRouter;