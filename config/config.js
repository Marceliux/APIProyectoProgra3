//====================================
//Configuración del puerto
//====================================
process.env.PORT = process.env.PORT || 8080;
//====================================
//Configuración del Entorno
//====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//====================================
//Configuración database
//====================================
let urlDB  = 'mongodb://localhost:27017/android-node';
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/android-node';
    
}else{
    urlDB = 'mongodb://chelito:admin1@ds127015.mlab.com:27015/android-node';
}

process.env.uriDB = urlDB;