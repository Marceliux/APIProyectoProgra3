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
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/android-node';
}else{
    urlDB = 'mongodb+srv://chelito:kXyJIQ3xBzHO34GT@cluster0-rrpjo.mongodb.net/android-node';

    //Mlab
    //'mongodb://chelito:123456a@ds213896.mlab.com:13896/android-node';
            
}

process.env.uriDB = urlDB;