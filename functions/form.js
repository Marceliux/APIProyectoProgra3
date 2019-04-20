'use strict';

const user = require('../models/user');

exports.getId = email => 
    new Promise((resolve,reject) => {
						user.find({ email: email }, {_id:1})
            .then(users => resolve( { user: users[0], status: 201, message: "Este es el user"} ))
            .catch(err => reject({ status: 500, message: 'Internal Server Error ! ' }))
    });



