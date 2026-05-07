const Role = require('../Models/Role')

async function CreateRole(req, res) {

    try {
        const { Name } = req.body
        if (!Name || Name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "The 'Name' field is required and cannot be empty."
            })
        }

        const createrole = await Role.create({ Name: Name.trim().toLowerCase() })
        return res.status(201).json({
            success: true,
            message: "Role created successfully", 
            role: {
                id: createrole._id, 
                name: createrole.Name
            }
        })


    } catch (error) {
        console.error('Role Creation error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Conflict: Role already exists",
                details: `The Role name '${req.body.Name}' is already in use.`
            })
        }

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred during role creation." 
        })
    }
}


async function AllRole(req, res) {

    try {

        const Findall = await Role.find().select('Name')
        if (Findall.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Roles found in DataBase"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Successfully retrieved all roles.",
            count: Findall.length,
            roles: Findall 
        })

    } catch (error) {

        console.error('Role Finding error:', error)


        return res.status(500).json({
            success: false,
            message: "Failed to retrieve roles due to an internal server issue."
        })
    }
}

module.exports = { CreateRole, AllRole }