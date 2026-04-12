import Mailgen from "mailgen";

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

export { emailVerificationTemplate, forgotPasswordTemplate };
