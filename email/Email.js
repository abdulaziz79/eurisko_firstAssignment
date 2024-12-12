import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD, 
    },
  });

  const sendEmail = async (to, subject, text, html) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to, 
        subject,
        text, 
        html, 
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  export default sendEmail