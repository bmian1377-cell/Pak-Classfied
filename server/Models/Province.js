const { Schema, model } = require('mongoose');

const ProvinceSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    CountryId: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true
    }
});

const Province = model("Province", ProvinceSchema);
module.exports = Province;