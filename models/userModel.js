const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Tạo model User
const User = mongoose.model('User', userSchema);

module.exports = User;
