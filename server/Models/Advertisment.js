const mongoose = require('mongoose');
const AdvertismentSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Price: { type: Number, required: true },
    Features: { type: String, required: true },
     Images: [{ type: String, required: true }], 
    StartsOn: { type: Date, required: true },
    EndsOn: { type: Date, required: true },
    CityAreaId: { type: mongoose.Schema.Types.ObjectId, ref: "CityArea", required: true },
    StatusId: { type: mongoose.Schema.Types.ObjectId, ref: "Status", required: true },
    CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    OwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Advertisment', AdvertismentSchema);