const Province = require('../Models/Province')
const Country = require('../Models/Country')

async function CreateProvince(req, res) {

    try {
        const { Name, CountryId } = req.body

        if (!Name || Name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Validation failed: 'Name' field is required and cannot be empty." 
            })
        }

        const countryexist = await Country.findById(CountryId)
        if (!countryexist) {
            return res.status(404).json({
                success: false,
                message: "Reference Error: The specified CountryId does not exist."
            })
        }

        const createprovince = await Province.create({
            Name: Name.trim().toLowerCase(),
            CountryId: CountryId
        })
        return res.status(201).json({
            success: true,
            message: "Province created successfully.",
            province: {
                id: createprovince._id,
                name: createprovince.Name,
                countryId: createprovince.CountryId
            }
        })

    } catch (error) {
        console.error('Province Creation error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Conflict: Province Already exists",
                details: `The Province name '${req.body.Name}' in this Country is already in use.`
            })
        }

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred during province creation."
        })
    }


}

async function AllProvince(req, res) {
    try {
        
        const allprovinces = await Province.find()
            .select('Name CountryId') 
            .populate({
                path: 'CountryId',
                select: 'Name' 
            });

      
        if (allprovinces.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No provinces found in the database."
            });
        }

       
        return res.status(200).json({
            success: true,
            message: "Successfully retrieved all provinces.",
            count: allprovinces.length,
            provinces: allprovinces 
        });
    } catch (error) {
        console.error('Province Finding error:', error);

        
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve provinces due to an internal server issue."
        });
    }
}

module.exports = {CreateProvince,AllProvince}