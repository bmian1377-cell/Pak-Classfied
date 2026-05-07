const nodemailer = require('nodemailer')
const Contact = require('../Models/Contact')

async function sendContactEmail(req,res) {
   
    try {
 const {name , email ,subject , message} = req.body
 const newQuery = new Contact({name, email, subject , message})
 await newQuery.save()
 const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // Jahan complain receive karni hai
            subject: `Contact Inquiry: ${subject}`,
            html: `<h4>New Message from ${name}</h4>
                   <p><b>Email:</b> ${email}</p>
                   <p><b>Message:</b> ${message}</p>`
        };
res.status(200).json({ success: true, message: "Query sent successfully!" });
        await transporter.sendMail(mailOptions);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    
}

module.exports = {sendContactEmail}