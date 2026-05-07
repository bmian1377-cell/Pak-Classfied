const { Schema, model } = require('mongoose');

const CitySchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    ProvinceId: {
        type: Schema.Types.ObjectId,
        ref: "Province",
        required: true
    }
});

const City = model("City", CitySchema);
module.exports = City;