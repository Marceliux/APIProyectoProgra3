'use strict';

require('./config/config');

const express    = require('express');        
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();

//se inicializa el servidor y la conexión a la DB
const app = express();
require('./database/database');   


app.use(bodyParser.json());
//sirve para extraer datos de metodos POST
app.use(bodyParser.urlencoded({extended:true}));

//Mensajes consola para debugg
app.use(logger('dev'));

//Trae las rutas y las guarda en router
require('./routes')(router);

//Le dice al servidor que utilize esas rutas
app.use(router);

//Prendemos el servidor en un puerto dependiendo de el enviroment
app.listen(process.env.PORT, ()=> console.log(`Escuchando peticiones en puerto ${process.env.PORT}`));
