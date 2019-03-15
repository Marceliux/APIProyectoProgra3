'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.loginUser = (email, password) => 
	new Promise((resolve,reject) => {
		//hace petición al db buscando el "email"
		user.find({email})
		.then(users => {
			if (users.length == 0) {
				reject({status: 404, message: 'Usuario no encontrado!' });
			} else {
				return users[0];
			}
		})
		.then(user => {
		//hashea el password para revisarlo
			const hashed_password = user.hashed_password;
			if (bcrypt.compareSync(password, hashed_password)) {
				//si son iguales envia un JSON con status 200 y un mensaje con el email
				resolve({status: 200, message: email });
				//si no son iguales envia un JSON con status 401 y un mensaje
			} else {
				reject({ status: 401, message: 'Contraseña Incorrecta!' });
			}
		})
		.catch(err => reject({ status: 500, message: `Error Interno de servidor! ${err}` }));
	});