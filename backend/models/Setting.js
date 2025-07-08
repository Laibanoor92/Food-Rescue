import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    foodCategories: {
        type: [String],
        required: true,
        default: ['Produce', 'Bakery', 'Dairy', 'Meat', 'Prepared Meals', 'Non-Perishable'],
    },
    rules: {
        defaultExpiryHours: {
            type: Number,
            required: true,
            default: 4, // Default alert time in hours before expiry
            min: 1,
        },
        defaultAdminRole: {
            type: String,
            required: true,
            enum: ['admin', 'editor', 'viewer'], // Allowed roles
            default: 'viewer',
        },
        // Add other platform rules here as needed
        // e.g., maxDonationWeight, requiredVolunteerTraining, etc.
    },
    // Add other top-level settings sections if needed
    // e.g., emailTemplates: { welcome: '...', etc. }

}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Optional: Ensure only one settings document can exist (using a unique index on a constant field)
// settingSchema.index({ uniqueIdentifier: 1 }, { unique: true, default: 'global_settings' });
// If using this, add `uniqueIdentifier: { type: String, default: 'global_settings' }` to the schema.

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;