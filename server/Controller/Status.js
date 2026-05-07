const Status = require('../Models/AdvertismentStatus')

async function CreateStatus(req,res) {
    try {
 const {Name} = req.body
    if(!Name || Name.trim() === ''){
        return res.status(400).json({
            success: false,
            message: "The 'Name' field is required and cannot be empty."
        })
    }

    const createStatus = await Status.create({Name: Name.trim().toLowerCase()})
    return res.status(201).json({
        success:true,
        message:"Status created Successfully",
        status:{
            id: createStatus._id,
            name:createStatus.Name

        }
    })
    } catch (error) {

         console.error('status Creation error:', error)

       if(error.code === 11000){
        return res.status(409).json({
            success:false,
            message:"Conflict: status already exists",
            details:  `The status name '${req.body.Name}' is already in use.`
        })
       }
                    
         return res.status(500).json({
            success: false,
            message: "Failed to retrieve Data due to an internal server issue."
        })
    }
        
    }
   


    
async function GetStatus(req,res) {
        try {
            
          const Findall = await Status.find().select('Name')
              if(Findall.length === 0){
                return res.status(404).json({
                    success:false,
                    message:"No Status found in DataBase"
                })
              }

          return res.status(200).json({
            success:true,
            message:"Successfully retrieved all status.",
            count:Findall.length,
            statuses:Findall
          })

        } catch (error) {
            
       console.error('status Finding error:', error)
            

       return res.status(500).json({
        success:false,
        message:"Failed to create status due to an internal server issue"
       })
        }
        
    }
    
module.exports = {CreateStatus,GetStatus}