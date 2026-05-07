const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//sigunp
async function registerUser(req, res) {
    try {
        const { Name, Email, LoginID, Password, SecurityQuestion, SecurityAnswer, BirthDate, ContactNumber } = req.body;
        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "uploads/default_profile.png";

        if (!Name || !Email || !LoginID || !Password || !BirthDate || !ContactNumber) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }

        const user = await User.create({
            Name, Email, LoginID, Password, SecurityQuestion, SecurityAnswer,
            BirthDate: new Date(BirthDate),
            ContactNumber,
            Image: imagePath
        });

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Image: user.Image,
                ContactNumber: user.ContactNumber,
                LoginID: user.LoginID
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "User already exists." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

// LOGIN USER
async function loginUser(req, res) {
    try {
        const { loginID, password } = req.body;
        const user = await User.findOne({ LoginID: loginID }).select('+Password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    Image: user.Image,
                    LoginID: user.LoginID,
                    ContactNumber: user.ContactNumber 
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Login Error" });
    }
}

//UPDATE PROFILE
async function updateProfile(req, res) {
    try {
        const { Name, ContactNumber, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+Password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // for changing passowrd
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: "Please provide current password to set a new one." });
            }
            // Purana password check karein
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Current password is incorrect." });
            }
            user.Password = newPassword;
        }

        //for Image ,contact, Name
        if (req.file) {
            user.Image = req.file.path.replace(/\\/g, "/");
        }
        if (Name) user.Name = Name;
        if (ContactNumber) user.ContactNumber = ContactNumber;
        await user.save();

        // Password hide kar ke user wapis bhejein
        const updatedUser = user.toObject();
        delete updatedUser.Password;

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            user: updatedUser 
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message || "Update Failed" });
    }
}
const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ Email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This email address is not registered with us."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `PakClassified <${process.env.EMAIL_USER}>`, 
            to: email,
            subject: 'Your Password Reset OTP for PakClassified',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #00BF63;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Your One-Time Password (OTP) is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px; border: 1px dashed #ccc; padding: 10px; display: inline-block;">${otp}</p>
                    <p>This code is valid for <strong>10 minutes</strong>. If you did not make this request, please ignore this email.</p>
                    <br>
                    <p>Thank you,</p>
                    <p><strong>The PakClassified Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "An OTP has been sent to your email address. Please check your inbox."
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Server error. Could not send the email." });
    }
};

const VerifyOTP = async (req, res) => {

    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ Email: email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "invalid or Expired OTP."
            })
        }
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ success: true, message: "OTP Verified Successfully. You can now reset your password." });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: "Server error." });


    }
}
    const Resetpassword = async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            const user = await User.findOne({ Email: email })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            }

            user.Password = newPassword
            await user.save()

            res.status(200).json({ success: true, message: "Password has been reset successfully. Please login with your new password." });

        } catch (error) {
            console.error("Reset Password Error:", error);
            res.status(500).json({ success: false, message: "Server error. Could not reset password." });
        }
    };





module.exports = {
     registerUser,
      loginUser,
       updateProfile,
        ForgotPassword, 
        VerifyOTP,
        Resetpassword
     };
