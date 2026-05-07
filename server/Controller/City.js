const City = require('../Models/City')
const Province = require('../Models/Province')

async function CreateCity(req, res) {
    try {
        const { Name, ProvinceId } = req.body


        if (!Name || Name.trim() === '' || !ProvinceId) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: 'Name' and 'ProvinceId' fields are required."
            })
        }

        const provinceExist = await Province.findById(ProvinceId)
        if (!provinceExist) {
            return res.status(404).json({
                success: false,
                message: "Reference Error: The specified ProvinceId does not exist."
            })
        }

        const createCity = await City.create({
            Name: Name.trim().toLowerCase(),
            ProvinceId: ProvinceId
        })
        return res.status(201).json({
            success: true,
            message: "City created successfully.",
            city: {
                id: createCity._id,
                name: createCity.Name,
                provinceId: createCity.ProvinceId
            }
        })
    } catch (error) {
        console.error('City Creation error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Conflict: City already exists",
                details: `The City name '${req.body.Name}' in this Province is already in use.`
            })

        }
        return res.status(500).json({
            success: false,

            message: "An internal server error occurred during city creation."
        })
    }
}

async function AllCity(req, res) {
    try {

        const allCity = await City.find()
            .select('Name ProvinceId')
            .populate({
                path: 'ProvinceId',
                select: 'Name'
            });

        if (allCity.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No cities found in the database."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved all cities.",
            count: allCity.length,
            cities: allCity
        });
    } catch (error) {
        console.error('Cities Finding error:', error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cities due to an internal server issue."
        });
    }
}

module.exports = { CreateCity, AllCity }