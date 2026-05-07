const { Schema, model } = require('mongoose');

const CountrySchema = new Schema({
    Name: {
        type: String,
        required: true,
         unique: true
    }
});

const Country = model("Country", CountrySchema);
module.exports = Country;