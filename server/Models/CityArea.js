const { Schema, model } = require('mongoose');

const CityAreaSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    CityId: {
        type: Schema.Types.ObjectId,
        ref: "City",
        required: true
    }
});

const CityArea = model("CityArea", CityAreaSchema);
module.exports = CityArea;