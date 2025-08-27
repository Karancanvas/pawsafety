import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECEIVE_EMAIL) {
    console.error("❌ Missing required environment variables. Please check your .env file");
    process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "*", // Allow all origins for now (safe since it's just dev)
}));

// Nodemailer transporter (Gmail + App Password)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter connection
transporter.verify(function (error, success) {
    if (error) {
        console.error("❌ Nodemailer transporter error:", error);
    } else {
        console.log("✅ Nodemailer transporter is ready to send emails");
    }
});

// Contact form route - FIXED ENDPOINT
app.post("/contact", async (req, res) => {
    try {
        console.log("📧 Received contact form submission:", req.body);

        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, and message are required fields." 
            });
        }

        const mailOptions = {
            from: `"PawSafety Website" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVE_EMAIL,
            subject: `🐾 New Contact Form: ${subject || "General Inquiry"}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff6b6b;">New Contact Form Submission</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                        <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #ff6b6b;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        This message was sent from the PawSafety website contact form.
                    </p>
                </div>
            `,
            text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "General Inquiry"}

Message:
${message}
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("✅ Email sent successfully:", info.messageId);
        
        res.status(200).json({ 
            success: true, 
            message: "Thank you! Your message has been sent successfully." 
        });
        
    } catch (error) {
        console.error("❌ Error sending email:", error);
        
        res.status(500).json({ 
            success: false, 
            message: "Failed to send email. Please try again later.",
            error: error.message 
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "PawSafety backend is running",
        timestamp: new Date().toISOString()
    });
});

// Handle undefined routes
app.use("*", (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: "Route not found" 
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error("🚨 Unhandled error:", error);
    res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
    });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running at http://localhost:${PORT}`);
    console.log(`📧 Email service configured for: ${process.env.EMAIL_USER}`);
});