const Country = require('../Models/Country')

async function CreateCountry(req, res) {


    try {
        const { Name } = req.body;

        if (!Name || Name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "The 'Country' field is required and cannot be empty."
            })
        }
        const countryName = Name.trim().toLowerCase()

      const existingCountry = await Country.findOne({Name: countryName})
      if(existingCountry){
        return res.status(409).json
        ({ success: false, 
            message: "Conflict: Country already exists." 
        });
      }
        const createcountry = await Country.create({ Name: countryName })
        return res.status(201).json({
            success: true,
            message: "Created Successfully",
            country: {
                name: createcountry.Name
            }

        })
    } catch (error) {

        console.error('creation error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Conflict: Country already exists",
                Details: `The Country name '${req.body.Name}' is already in use.`
            })
        }

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve Data due to an internal server issue."
        })

    }



}



async function AllCountry(req, res) {
    try {
        const allcountry = await Country.find().select('Name')

        if (allcountry.length === 0) {
            return res.status(404).json({
                success: false,
                message:"No Countries found in DataBase"
            })

        }
        return res.status(200).json({
            success: true,
            message:  "Successfully retrieved all countries.",
            count: allcountry.length,
            countries: allcountry
        })

    } catch (error) {
       console.error('Country Finding error:', error) 

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve Data due to an internal server issue."
        })
    }

}

module.exports ={CreateCountry,AllCountry}