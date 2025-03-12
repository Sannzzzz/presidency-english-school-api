require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");  // ✅ Import CORS
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,   
  },
});

// Handle form submission
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Message from ${name}`,  // ✅ Fixed backticks
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Error sending email! " + error.message });
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);  // ✅ Fixed backticks
});
