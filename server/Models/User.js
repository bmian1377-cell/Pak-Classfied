// Models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Please enter your name'], trim: true
    },
    Email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true
    },
    APIKey: {
        type: String,
        unique: true,
        sparse: true
    },
    LoginID: {
        type: String,
        unique: true,
        required: [true, 'Please enter a unique Login ID']
    },
    Password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 6,
        select: false
    },
    SecurityQuestion: {
        type: String,
        required: true
    },
    SecurityAnswer: {
        type: String,
        required: true
    },
    BirthDate: {
        type: Date,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        default: 'uploads/default_profile.png'
    },
    Role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },


    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Password Hashing
UserSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};

module.exports = mongoose.model('User', UserSchema);