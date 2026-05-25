// email-service.js - For real email sending
// Sign up at https://www.emailjs.com/ for free email service

// Initialize EmailJS (replace with your credentials)
(function() {
    emailjs.init("YOUR_USER_ID"); // Get from EmailJS dashboard
})();

function sendResetEmail(userEmail, otp) {
    const templateParams = {
        to_email: userEmail,
        otp_code: otp,
        subject: "Password Reset OTP - Portfolio CMS",
        message: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`
    };
    
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
        .then(function(response) {
            console.log("Email sent successfully!", response);
            showSuccess("OTP sent to your email!");
        })
        .catch(function(error) {
            console.error("Email failed:", error);
            showError("Failed to send email. Please try again.");
        });
}