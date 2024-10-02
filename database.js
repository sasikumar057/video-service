// Import the mongoose module to interact with the MongoDB database.
const mongoose = require('mongoose');

// Import and configure dotenv to load environment variables from a .env file into process.env,
// making it easy to configure your application's settings without hard-coding them into your source code.
require('dotenv').config();

// Connect to the MongoDB database using the URI provided in the environment variables.
// The URI is expected to be defined in the .env file under the variable MONGO_URI.
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,  // Use the new URL parser which is more secure and robust.
  useUnifiedTopology: true  // Use the new topology engine which helps in handling server discoveries and monitoring more effectively.
})
.then(() => console.log("MongoDB connected"))  // Log a success message if the connection is successful.
.catch(err => console.error("MongoDB connection error:", err));  // Catch and log any errors that occur during connection.

// Export the configured mongoose instance to be used in other parts of the application.
// This allows other files to require this configured instance and use it to define models, make queries, etc.
module.exports = mongoose;
