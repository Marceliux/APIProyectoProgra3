'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");

exports.changePassword = (email, password, newPassword) => 
	new Promise((resolve, reject) => {
		//hace una busqueda al db buscando "email"
		user.find({ email: email })
		.then(users => {
			let user = users[0];
			const hashed_password = user.hashed_password;
			if (bcrypt.compareSync(password, hashed_password)) {
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(newPassword, salt);
				user.hashed_password = hash;
				return user.save();
			} else {
				reject({ status: 401, message: 'Contraseña antigua inválida !' });
			}
		})
		.then(user => resolve({ status: 200, message: 'Contraseña actualizada correctamente !' }))
		.catch(err => reject({ status: 500, message: 'Error de servidor !' }));
	});

exports.resetPasswordInit = email =>
	new Promise((resolve, reject) => {
		const random = randomstring.generate(8);
		user.find({ email: email })
		.then(users => {
			if (users.length == 0) {
				reject({ status: 404, message: 'User Not Found !' });
			} else {
				let user = users[0];
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(random, salt);
				user.temp_password = hash;
				user.temp_password_time = new Date();
				return user.save();
			}
		})

		.then(user => {
			//const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.gmail.com`);
			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
				  user: `proyectoprograUTC@gmail.com`,
				  pass: `proyectoprogra1!`
				}
			  });
			const mailOptions = {
    			from: `"Administrador Proyecto Programacion 3 UTC" <proyectoprograUTC@gmail.com>`,
    			to: email,  
    			subject: 'Solicitud para restablecer contraseña', 
				html: `
				Hola ${user.name},
					<br><br><br>
    			     Su token para reiniciar la contraseña es <b>${random}</b>. 
    			Sí estás viendo este correo desde un Android Device da click en este <a href="http://gymapp/${random}">link</a>. 
    			El token es válido por dos minutos.

    			Gracias,
    			GymApp.`

			};
			return transporter.sendMail(mailOptions);
		})
		.then(info => {
			console.log(info);
			resolve({ status: 200, message: 'Busca en tu correo las instrucciones' })
		})
		.catch(err => {
			console.log(err);
			reject({ status: 500, message: 'Internal Server Error !' });
		});
	});

exports.resetPasswordFinish = (email, token, password) => 
	new Promise((resolve, reject) => {
		user.find({ email: email })
		.then(users => {
			let user = users[0];
			const diff = new Date() - new Date(user.temp_password_time); 
			const seconds = Math.floor(diff / 1000);
			console.log(`Seconds : ${seconds}`);
			if (seconds < 120) { return user; } else { reject({ status: 401, message: 'Time Out ! Try again' }); } }) .then(user => {
			if (bcrypt.compareSync(token, user.temp_password)) {
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(password, salt);
				user.hashed_password = hash;
				user.temp_password = undefined;
				user.temp_password_time = undefined;
				return user.save();
			} else {
				reject({ status: 401, message: 'Token Inválido !' });
			}
		})

		.then(user => resolve({ status: 200, message: 'Password nuevo!' }))
		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});