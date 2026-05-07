const Advertisment = require('../Models/Advertisment');
const Category = require('../Models/AdvertismentCategory');
const Status = require('../Models/AdvertismentStatus');
const CityArea = require('../Models/CityArea');

//helper function for check refernces
async function CheckRef(CategoryId, StatusId, CityAreaId) {
    try {
        const [categoryExist, statusExist, areaExist] = await Promise.all([
            CategoryId ? Category.findById(CategoryId) : null,
            StatusId ? Status.findById(StatusId) : null,
            CityAreaId ? CityArea.findById(CityAreaId) : null
        ]);

        const missing = [];
        if (CategoryId && !categoryExist) missing.push('CategoryId');
        if (StatusId && !statusExist) missing.push('StatusId');
        if (CityAreaId && !areaExist) missing.push('CityAreaId');

        return missing;
    } catch (err) {
        return ['Database Connection Error'];
    }
}

async function CreateAdvertisment(req, res) {
    try {
        const ownerId = req.user._id;

         if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "Images are required" });
        }
        const imagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

        // ✅ Body se data nikaalein lekin Images ko alag rakhein
        const { Images, ...restOfBody } = req.body; 
        
        const missingRef = await CheckRef(restOfBody.CategoryId, restOfBody.StatusId, restOfBody.CityAreaId);
        if (missingRef.length > 0) return res.status(400).json({ success: false, message: "Invalid IDs" });

        const createAdvert = await Advertisment.create({
            ...restOfBody,
            OwnerId: ownerId,
            Images: imagePaths, // Sirf Multer wale sahi paths save honge
            Price: Number(restOfBody.Price)
        });

        res.status(201).json({ success: true, advertisement: createAdvert });
    } catch (error) {
        console.log("Create Ad Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//for latestPage
async function GetAllAdsOrLatest(req, res) {
    try {
        const { latest } = req.query; 
        let queryBuilder = Advertisment.find({ isActive: true }).sort({ createdAt: -1 })
            .populate('CityAreaId', 'Name')
            .populate('StatusId', 'Name')
            .populate('CategoryId', 'Name');

        if (latest === 'true') { 
            queryBuilder = queryBuilder.limit(3); 
        }

        const allAdverts = await queryBuilder.exec();
        res.status(200).json({ success: true, advertisements: allAdverts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching ads" });
    }
}

//byCargeory
async function GetAdvertismentByCategory(req, res) {
    try {
        const { categoryId } = req.params;
        const ads = await Advertisment.find({ CategoryId: categoryId, isActive: true })
            .sort({ createdAt: -1 })
            .populate('CityAreaId', 'Name')
            .populate('StatusId', 'Name')
            .populate('CategoryId', 'Name');
        
        res.status(200).json({ success: true, advertisements: ads });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category ads" });
    }
}

//for dashborad
async function GetMyAds(req, res) {
    try {
        const ownerId = req.user._id; 
        const userAds = await Advertisment.find({ OwnerId: ownerId }).sort({ createdAt: -1 })
            .populate('CityAreaId', 'Name')
            .populate('StatusId', 'Name')
            .populate('CategoryId', 'Name');

        res.status(200).json({ success: true, advertisements: userAds });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching dashboard ads" });
    }
}

//for update
async function UpdateAdvertisment(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Pehle check karo ke ad is user ki hi hai na?
        let ad = await Advertisment.findById(id);
        if (!ad || ad.OwnerId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Agar nayi image aayi hai toh usko bhi update karo
        if (req.files && req.files.length > 0) {
            req.body.Images = req.files.map(file => file.path.replace(/\\/g, "/"));
        }

        const updatedAd = await Advertisment.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, advertisement: updatedAd });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
}

//For Delete
async function DeleteAdvertisment(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        let ad = await Advertisment.findById(id);
        if (!ad || ad.OwnerId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Advertisment.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
}

//for single Ad
async function GetAdvertismentByID(req, res) {
    try {
        const adId = req.params.id;

      
        const ad = await Advertisment.findByIdAndUpdate(
            adId, 
            { $inc: { Hits: 1 } }, 
            { new: true } 
        )
        .populate('CityAreaId', 'Name')
        .populate('CategoryId', 'Name')
        .populate('StatusId', 'Name')
        .populate('OwnerId', 'Name Email ContactNumber Image');

        if(!ad) {
            return res.status(404).json({ success: false, message: "Ad not found" });
        }
        
        res.status(200).json({ success: true, advertisement: ad });

    } catch (error) {
        console.log("Single Ad Error:", error);
        res.status(500).json({ success: false, message: "Error fetching ad details" });
    }
}

//for search
async function SearchAds(req, res) {
    try {
        const { keyword, category, area } = req.query;
        let query = { isActive: true }; // only active ads
        
        if (keyword){
            query.$or = [
                { Name: { $regex: keyword, $options: 'i' } }, //by name
                { Description: { $regex: keyword, $options: 'i' } }// by description
            ];
        }
        if (category) query.CategoryId = category;
        if (area) query.CityAreaId = area;

        const ads = await Advertisment.find(query)
            .populate('CityAreaId', 'Name')
            .populate('CategoryId', 'Name');
            
        res.status(200).json({ success: true, advertisements: ads });
    } catch (error) {
        res.status(500).json({ success: false, message: "Search failed" });
    }
}
module.exports = { 
    CreateAdvertisment, 
    GetAllAdsOrLatest, 
    GetAdvertismentByCategory, 
    GetAdvertismentByID, 
    GetMyAds, 
    UpdateAdvertisment, 
    DeleteAdvertisment ,
    SearchAds
};