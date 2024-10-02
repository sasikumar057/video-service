// Import the mongoose module to interact with the MongoDB database.
const mongoose = require('mongoose');

// Import the bcryptjs module for hashing passwords.
const bcrypt = require('bcryptjs');

// Define a new schema for the User model with fields for username and password.
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // 'username' must be a string, is required, and must be unique in the database.
  password: { type: String, required: true }  // 'password' must be a string and is required.
});

// Add a pre-save hook to the User schema that automatically hashes the password before saving it to the database.
UserSchema.pre('save', async function(next) {
  // Check if the password field has been modified (to avoid rehashing unless necessary).
  if (!this.isModified('password')) return next();  // If the password hasn't changed, skip to the next middleware.

  // Hash the password with a cost factor (or salt rounds) of 8, which determines how securely bcrypt hashes the password.
  this.password = await bcrypt.hash(this.password, 8);  // Replace the plain text password with the hashed version.
  
  // Proceed to the next middleware or save operation.
  next();
});

// Create a model using the schema defined above. This model provides the interface to the MongoDB collection for the User documents.
const User = mongoose.model('User', UserSchema);

// Export the User model to be used in other parts of the application.
module.exports = User;
