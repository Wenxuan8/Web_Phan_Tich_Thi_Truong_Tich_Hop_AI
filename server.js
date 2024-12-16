// server.js

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userModel');  // Giả sử bạn đã có model User
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Để có thể nhận dữ liệu JSON từ request

// Route đăng ký người dùng
app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Kết nối MongoDB và khởi chạy server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/market-analysis-db')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
