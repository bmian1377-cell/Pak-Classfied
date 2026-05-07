const mongoose = require(`mongoose`)

async function Connectdb() {


    try {
         await mongoose.connect(process.env.URL)
    console.log(`database is Connected`)
    } catch (error) {

        console.log(`reconnect the Mongodb`,error.message)
        process.exit(1)
        
    }
   
    
}

module.exports = Connectdb;