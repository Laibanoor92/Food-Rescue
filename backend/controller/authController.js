import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const BASE_URL = 'http://localhost:5173'; // Change to your frontend URL

// Configure Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Signup
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contact, role, organizationName, organizationType } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        
        const newUser = new User({
            firstName, lastName, email, password: hashedPassword, contact, role, organizationName, organizationType,
            isVerified: false, verificationToken
        });
        await newUser.save();
        
        const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        });
        
        res.status(201).json({ message: 'User registered. Please check your email for verification link.' });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup', error });
    }
};

// Email Verification
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Log the request details for debugging
        console.log(`Login attempt for email: ${email}`);
        
        // Find the user and explicitly include the password field for comparison
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        if (!user.isVerified) {
            console.log(`User not verified: ${email}`);
            return res.status(400).json({ message: 'Email not verified' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match for ${email}: ${isMatch}`);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Create a user object without the password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        // Create token with userId (not id) to match middleware expectations
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        console.log(`Login successful for: ${email}, role: ${user.role}`);
        
        // Return token and user without password
        res.json({ 
            token, 
            user: userWithoutPassword,
            // Add debugging info
            message: 'Login successful' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error during login', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        
        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
        await user.save();
        
        const resetLink = `${BASE_URL}/api/auth/reset-password/${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset email', error });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findOne({ email: decoded.email, resetToken: token, resetTokenExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
        
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.resetToken = null;
        user.resetTokenExpire = null;
        await user.save();
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};
