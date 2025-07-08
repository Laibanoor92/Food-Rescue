import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8,
        select: false // Don't return password in queries
    },
    contact: { 
        type: String, 
        required: true, 
        trim: true
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['volunteer', 'donor', 'recipient', 'admin'], 
        default: 'volunteer'
    },
    organization: {
        name: { 
            type: String, 
            trim: true, 
            required: function() { return this.role === 'donor' || this.role === 'recipient'; }
        },
        type: { 
            type: String, 
            enum: ['Restaurant/Hotel', 'Food Bank', 'NGO', 'Individual', ''],
            trim: true,
            required: function() { return this.role === 'donor' || this.role === 'recipient'; }
        }
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationToken: String,
    verificationTokenExpires: Date,  // Added this field
    resetToken: String,
    resetTokenExpire: Date,
    lastLogin: Date
}, { 
    timestamps: true 
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// // Method to compare password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema);

export default User;