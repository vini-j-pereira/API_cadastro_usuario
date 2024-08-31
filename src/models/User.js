const mongoose = require('mongoose');

const UserRegister = mongoose.model('UserRegister', {
    email: String,
    telefone: String,
    password: String
});

module.exports = UserRegister; 