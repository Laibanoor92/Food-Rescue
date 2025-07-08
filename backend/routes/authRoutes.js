import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL; // Frontend URL for email links

// Nodemailer setup
const setupTransporter = async () => {
    // In development, provide option to use test account
    if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST === 'true') {
      console.log('Setting up test email account...');
      try {
        // Create ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        console.log('Test email account created:');
        console.log(`- Username: ${testAccount.user}`);
        console.log(`- Password: ${testAccount.pass}`);
        
        // Return Ethereal test transporter
        return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (error) {
        console.error('Failed to create test account. Falling back to configured email service:', error);
      }
    }

      // Use configured email service
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug info in development
  });
};

// Initialize transporter
let transporter;
setupTransporter()
  .then(t => {
    transporter = t;
    
    // Verify connection
    return transporter.verify();
  })
  .then(() => {
    console.log('✅ Email service connected and ready to send emails');
  })
  .catch(error => {
    console.error('❌ Email service connection failed:', error);
    console.log('Email functionality will not work until this is fixed');
  });

  // Helper function to send emails with enhanced logging and error handling
const sendEmail = async (options) => {
    try {
      if (!transporter) {
        console.error('Email transporter not initialized');
        return { success: false, error: 'Email service not available' };
      }
      
      console.log(`Attempting to send email to: ${options.to}`);
      const info = await transporter.sendMail(options);
      
      console.log('Email sent successfully:');
      console.log(`- Message ID: ${info.messageId}`);
      console.log(`- Accepted recipients: ${info.accepted.join(', ')}`);
      
      // For Ethereal test emails, show the preview URL
      if (process.env.NODE_ENV === 'development' && process.env.EMAIL_TEST === 'true') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`- Preview URL: ${previewUrl}`);
        console.log('👆 Click the preview URL above to view the email in your browser');
      }
      return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
      console.error('Failed to send email:');
      console.error(`- Error name: ${error.name}`);
      console.error(`- Error message: ${error.message}`);
      if (error.response) console.error(`- SMTP response: ${error.response}`);
      return { success: false, error: error.message };
    }
  };
  
// Register User & Send Verification Email
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', JSON.stringify(req.body));
        
        const { firstName, lastName, email, password, contact, role, organizationName, organizationType } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !password || !contact || !role) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }
        
        // Validate organization fields for donor/recipient
        if ((role === 'donor' || role === 'recipient') && (!organizationName || !organizationType)) {
            return res.status(400).json({ 
                success: false,
                message: 'Organization details are required for donors and recipients' 
            });
        }
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        // Generate verification token
       // In your signup route, when generating the token
const rawToken = crypto.randomBytes(32).toString('hex');

// Trim and clean the token
const verificationToken = rawToken.trim();

console.log(`Raw token: ${rawToken}`);
console.log(`Cleaned token: ${verificationToken}`);
console.log(`Are they different? ${rawToken !== verificationToken}`);
const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user object with correct schema structure
        const userData = {
            firstName,
            lastName,
            email,
            password, // Will be hashed by pre-save hook in the model
            contact,
            role,
            verificationToken,
            verificationTokenExpires,
            isVerified: false
        };
        
        // Add organization data in the correct structure if needed
        if (role === 'donor' || role === 'recipient') {
            userData.organization = {
                name: organizationName,
                type: organizationType
            };
        }

        console.log('Creating user with data:', {...userData, password: '[REDACTED]'});
        
        // Create and save user
        user = new User(userData);
        await user.save();

        console.log(`User created with verification token: ${verificationToken}`);
        console.log(`Verification token length: ${verificationToken.length}`);
        console.log(`Token expiration: ${verificationTokenExpires}`);

        // Immediately fetch the user to ensure token was saved correctly
        const savedUser = await User.findOne({ email }).select('+verificationToken +verificationTokenExpires');
        console.log(`Verification token retrieved from database: ${savedUser.verificationToken}`);
        console.log(`Token from DB length: ${savedUser.verificationToken.length}`);

        // Create verification link
        const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';;
        const verificationLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
        console.log('Generated verification link:', verificationLink);

        // Create email HTML
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #4CAF50; text-align: center;">Welcome to Food Rescue</h2>
                <p>Hello ${firstName},</p>
                <p>Thank you for registering with Food Rescue. Please verify your email address to complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Verify My Email
                    </a>
                </div>
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background-color: #f9f9f9; padding: 10px; font-size: 14px;">${verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Food Rescue Team</p>
            </div>
        `;

  // In your signup route, replace the email sending part with:
try {
    console.log('Sending verification email...');
    
    // Send verification email using the enhanced helper function
    const emailResult = await sendEmail({
        from: `"Food Rescue" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Food Rescue',
        html: emailHTML
    });
    
    if (emailResult.success) {
        console.log('Verification email sent successfully');
        if (emailResult.previewUrl) {
            console.log(`Preview URL: ${emailResult.previewUrl}`);
        }
    } else {
        console.error(`Failed to send verification email: ${emailResult.error}`);
    }
} catch (emailError) {
    // Log email error but don't fail the registration
    console.error('Unexpected error sending verification email:', emailError);
}

        // Return success response
        res.status(201).json({ 
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            userId: user._id
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
});


// Email verification route
router.get('/verify-email/:token', async (req, res) => {
    try {
        // Extract token and remove ":1" suffix if present
        let tokenParam = req.params.token;
        if (tokenParam.includes(':')) {
            console.log(`Found colon in token: ${tokenParam}`);
            tokenParam = tokenParam.split(':')[0];
            console.log(`Cleaned token: ${tokenParam}`);
        }
        
        console.log(`Attempting to verify email with token: ${tokenParam}`);
        console.log(`Token length: ${tokenParam.length}`);
        
        // Try both raw token and decoded token
        const decodedToken = decodeURIComponent(tokenParam);
        console.log(`Decoded token: ${decodedToken}`);
        console.log(`Decoded token length: ${decodedToken.length}`);
        
        // Direct token comparison with database entries
        const allUsers = await User.find({ 
            verificationToken: { $exists: true, $ne: null }
        }).select('email verificationToken');

        console.log(`Looking for matches to token: ${tokenParam}`);
        allUsers.forEach(u => {
            const isMatch = u.verificationToken === tokenParam;
            const similarity = [...tokenParam].filter((c, i) => u.verificationToken[i] === c).length / tokenParam.length * 100;
            console.log(`User ${u.email}: Token match: ${isMatch}, Similarity: ${similarity.toFixed(2)}%`);
        });
        
        // Find user with either version of the token
        let user = await User.findOne({ verificationToken: tokenParam });
        
        // If not found with raw token, try decoded token
        if (!user && tokenParam !== decodedToken) {
            user = await User.findOne({ verificationToken: decodedToken });
            console.log(`Tried with decoded token: ${user ? 'found' : 'not found'}`);
        }
        
        if (!user) {
            console.log('No user found with the provided verification token');
            
            // Check if there are any users with tokens at all (for debugging)
            const anyTokenUsers = await User.find({
                verificationToken: { $exists: true, $ne: null }
            }).countDocuments();
            
            console.log(`Number of users with verification tokens: ${anyTokenUsers}`);
            
            return res.status(400).json({ 
                success: false,
                message: 'Invalid verification token' 
            });
        }
        
        // Check if token is expired, but only if we found a user
        if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
            console.log(`Token expired at ${user.verificationTokenExpires}`);
            return res.status(400).json({ 
                success: false,
                message: 'Verification link has expired. Please request a new one.',
                expired: true
            });
        }
        
        // If user is already verified
        if (user.isVerified) {
            console.log(`User ${user.email} is already verified`);
            return res.status(200).json({ 
                success: true,
                message: 'Email is already verified. You can now login to your account.' 
            });
        }
        
        // Update user as verified
        console.log(`Verifying email for user: ${user.email}`);
        user.isVerified = true;
        await user.save();
        
        console.log(`Email successfully verified for user: ${user.email}`);
        res.status(200).json({ 
            success: true,
            message: 'Email verified successfully! You can now login to your account.' 
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error occurred while verifying email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// TEMPORARY DEBUG ROUTE - REMOVE IN PRODUCTION
router.get('/debug/token/:token', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'Not available in production' });
    }
    
    try {
        const { token } = req.params;
        console.log(`Debug request for token: ${token}`);
        
        // Find user by exact token (without expiration check)
        const exactUser = await User.findOne({ verificationToken: token });
        
        // Try to find users with similar tokens (first 10 chars)
        const similarUsers = await User.find({
            verificationToken: { $regex: new RegExp('^' + token.substring(0, 10)) }
        }).select('email verificationToken verificationTokenExpires');
        
        // Check if token contains URL-encoded characters
        const decodedToken = decodeURIComponent(token);
        const containsEncoding = decodedToken !== token;
        
        return res.json({
            token: {
                provided: token,
                length: token.length,
                containsEncoding,
                decodedToken: containsEncoding ? decodedToken : undefined,
            },
            exactMatch: exactUser ? {
                found: true,
                email: exactUser.email,
                isVerified: exactUser.isVerified,
                tokenExpires: exactUser.verificationTokenExpires,
                isExpired: exactUser.verificationTokenExpires < new Date()
            } : { found: false },
            similarMatches: similarUsers.length,
            similarUsers: similarUsers.map(u => ({
                email: u.email,
                tokenPreview: `${u.verificationToken.substring(0, 5)}...${u.verificationToken.substring(u.verificationToken.length - 5)}`,
                tokenLength: u.verificationToken.length,
                isExpired: u.verificationTokenExpires < new Date()
            }))
        });
    } catch (error) {
        console.error('Token debug error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});


// Login Route

router.post('/login', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email }).select("+password"); // 🔹 Explicitly select password
        console.log("User Found:", user ? user.email : "No user found");

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        console.log("Entered Password:", password);
        console.log("Password check in progress...");

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        
        // ✅ Remove password before sending response
        const userObject = user.toObject();
        delete userObject.password;  // Remove password field from user object
        
        // ✅ Send the cleaned userObject, not the original user document
        res.json({ token, user: userObject });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({ resetToken: req.params.token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;



