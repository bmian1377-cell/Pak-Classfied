const CityArea = require('../Models/CityArea');
const City = require('../Models/City'); 


async function CreateCityArea(req, res) {
    try {
        const { Name, CityId } = req.body;

      
        if (!Name || Name.trim() === '' || !CityId) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: 'Name' and 'CityId' fields are required."
            });
        }

      
        const cityExist = await City.findById(CityId);
        if (!cityExist) {
            return res.status(404).json({
                success: false,
                message: "Reference Error: The specified CityId does not exist."
            });
        }

    
        const createCityArea = await CityArea.create({
            Name: Name.trim().toLowerCase(), 
            CityId: CityId
        });

        
        return res.status(201).json({
            success: true,
            message: "City Area created successfully.",
            area: { 
                id: createCityArea._id,
                name: createCityArea.Name,
                cityId: createCityArea.CityId 
            }
        });
    } catch (error) {
        console.error('City Area Creation error:', error); 


        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Conflict: City Area already exists",
               
                details: `The Area name '${req.body.Name}' in this City is already in use.`
            });
        }

        return res.status(500).json({
            success: false,
   
            message: "An internal server error occurred during city area creation."
        });
    }
}

async function AllCityArea(req, res) {
    try {
    
        const allCityAreas = await CityArea.find()
            .select('Name CityId') 
            .populate({
                path: 'CityId',
                select: 'Name' 
            });

 
        if (allCityAreas.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No city areas found in the database."
            });
        }

      
        return res.status(200).json({
            success: true,
            message: "Successfully retrieved all city areas.",
            count: allCityAreas.length,
            areas: allCityAreas 
        });
    } catch (error) {
        console.error('City Area Finding error:', error); 

     
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve city areas due to an internal server issue."
        });
    }
}

module.exports = { CreateCityArea, AllCityArea };