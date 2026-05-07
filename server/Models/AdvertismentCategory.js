const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Image: {
        type: String,
        required: true 
    }
}, { timestamps: true });

const Category = model('Category', CategorySchema);
module.exports = Category;