import Mailgen from "mailgen";
import nodemailer from "nodemailer";



//for sending email, we will use mailgen to generate the email content and nodemailer to send the email
const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanager.com/"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailhtml = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailhtml
    }

    try{
        await transporter.sendMail(mail);

    }catch(error){
        console.error("Email service failed");
        console.error("Error: ", error);
    }
}


const emailVerificationTemplate = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome! We're very excited to have you on board.",
            action: {
                instructions: "To verify your email, please click the button below:",
                button: {
                    color: "#22BC66",
                    text: "Verify Email",
                    link: verificationUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        },
    };
};
    

const forgotPasswordTemplate = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset your password.",
            action: {
                instructions: "To reset your password, please click the button below:",
                button: {
                    color: "#2aa760",
                    text: "Reset Password",
                    link: passwordResetUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        },
    };
};

export { emailVerificationTemplate, forgotPasswordTemplate, sendEmail };
