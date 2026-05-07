const Category = require('../Models/AdvertismentCategory');

async function CreateCategory(req, res) {
    try {
        const { Name } = req.body;
        
        
        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";

        if (!Name || !imagePath) {
            return res.status(400).json({ success: false, message: "Name and Image file are required." });
        }

        const newCategory = await Category.create({
            Name: Name.trim(),
            Image: imagePath 
        });

        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function AllCategory(req, res) {
    try {
        const allCategories = await Category.find().sort({ Name: 1 }); 

        if (allCategories.length === 0) {
            return res.status(404).json({ success: false, message: "No categories found." });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved categories.",
            count: allCategories.length,
            categories: allCategories 
        });
    } catch (error) {
        console.error('Category Finding error:', error); 
        return res.status(500).json({ success: false, message: "Failed to fetch categories." });
    }
}

module.exports = { CreateCategory, AllCategory };