import nodemailer from "nodemailer";
import User from "@/models/userModel"
import bcryptjs from "bcryptjs";

// This helper creates a secure token and sends an email so the user can verify
// their account or reset their password. The token is stored in the database and
// then checked later in the verification route.
export const sendEmail = async({email, emailType, userId}:any) => {
    try{
     // Create a hashed token from the user's id. If someone reads the database,
     // they will not see the real id directly.
      const hashedToken= await bcryptjs.hash(userId.toString(), 10);

      if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId, {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000});
      } else if(emailType === "RESET"){
        await User.findByIdAndUpdate(userId, {forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000});
      }

    // This is the Mailtrap setup for sending emails in development.
     var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
    });

    // Create the email message with a verification or reset link.
    const mailOptions = {
       from: "no-reply@nextjs_authapp.com",
       to: email,
       subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
       html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}. or copy and paste the link below in your browser. <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`
    }

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
       
    }catch(error:any){
       throw new Error(error.message);
    }

}