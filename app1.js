  // Import the Express module to create and manage the HTTP server and routes.
  const express = require('express');

  // Import the express-session module to manage sessions within Express.
  const session = require('express-session');

  // Import the User model to interact with the user data in the MongoDB database.
  const User = require('./models/user');

  // Import the configured Mongoose instance to interact with the MongoDB database.
  const mongoose = require('./database');

  // Import the bcryptjs module for hashing and comparing passwords securely.
  const bcrypt = require('bcryptjs');

  // Import axios for making HTTP requests between servers.
  const axios = require('axios');

  const cors = require('cors'); // Import the CORS module to enable CORS in the Express app

  // Create an instance of an Express application.
  const app = express();

  // Middleware to parse JSON bodies. This lets you handle JSON data sent in POST requests.
  app.use(express.json());

  // Serve static files from the 'public' directory. This allows files like HTML, CSS, and JavaScript to be served directly.
  app.use(express.static('public'));

  // making it easy to configure your application's settings without hard-coding them into your source code.
  require('dotenv').config();

  app.use(cors({
    origin: "http://localhost:3000", // Allow requests from the frontend server on port 3000
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow cookies and authentication tokens to be shared
}));
  
  // Configure session middleware with session options.
  app.use(session({
    secret: process.env.SESSION_SECRET, // A secret used to sign the session ID cookie, keep it secure and change it for production.
    resave: true, // Forces the session to be saved back to the session store, even if it wasn't modified.
    saveUninitialized: false // Forces a session that is "uninitialized" to be saved to the store.
  }));

  // Define a POST route for user registration.
  app.post('/register', async (req, res) => {
    const { username, password } = req.body;  // Extract username and password from the request body.
    try {
      // Check if a user with the provided username already exists.
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        // If a user exists, send a 409 Conflict HTTP status code and message.
        return res.status(409).send('Username already taken');
      }

      // If no existing user, create a new user instance and save it to the database.
      const newUser = new User({ username, password });
      await newUser.save();

      // Send a 201 Created HTTP status after successful registration.
      res.status(201).send('User registered successfully');
    } 
    catch (error) {
      // Catch any other errors and send a 500 Internal Server Error status code.
      res.status(500).send(error.message);
    }
  });

  // Define a POST route for user login.
  // POST route for user login
 // Define a POST route for user login.
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;  // Extract username and password from the request body.
      const user = await User.findOne({ username });
      if (!user) {
          // If no user is found, return a 404 Not Found status.
          return res.status(404).send('User not found');
      }

      // Use bcrypt to compare the submitted password with the stored hashed password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          // If passwords do not match, return a 400 Bad Request status.
          return res.status(400).send('Invalid credentials');
      }

      // If the credentials are correct, save the user info in the session.
      req.session.user = user;

      // Send a JSON response with the success status and redirect URL for the frontend
      res.json({ success: true, redirectURL: 'http://localhost:3000' });
  } catch (error) {
      // Catch any other errors and send a 500 Internal Server Error status code.
      res.status(500).send(error.message);
  }
});


  // Backend: Express login route
  app.post('/login', async (req, res) => {
    // Your login logic...
    // If login is successful, send a JSON response with the redirect URL
    res.json({ success: true, redirectURL: 'http://localhost:3000/newpage' });
  });


  // Start the server on port 4000 and log a message to the console.
  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
  });
