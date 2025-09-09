// ============================================================================
// SAFEPORT BACKEND SERVER
// Main server file for SafePort cybersecurity website
// Handles user registration, contact forms, and serves frontend files
// ============================================================================

// Load environment variables from .env file (database passwords, etc.)
require('dotenv').config();

// Import required Node.js modules
const express = require('express');     // Web framework for Node.js
const cors = require('cors');           // Cross-Origin Resource Sharing middleware
const path = require('path');           // File path utilities
const { Pool } = require('pg');         // PostgreSQL database client

// Create Express application instance
const app = express();

// ============================================================================
// DATABASE CONNECTION SETUP
// ============================================================================

// Create PostgreSQL connection pool using environment variables for security
// Falls back to default values if environment variables are not set
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',           // Database username
    host: process.env.DB_HOST || 'localhost',          // Database server address
    database: process.env.DB_NAME || 'setup',          // Database name
    password: process.env.DB_PASSWORD || 'Texas2Abuj@', // Database password
    port: process.env.DB_PORT || 5432,                 // Database port (PostgreSQL default)
});

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Enable Cross-Origin Resource Sharing (allows frontend to communicate with backend)
app.use(cors());

// Parse JSON request bodies (for API calls from frontend forms)
app.use(express.json());

// Parse URL-encoded request bodies (for traditional form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================================================
// API ENDPOINTS
// ============================================================================

// USER REGISTRATION ENDPOINT
// Handles form submissions from get-started.html page
app.post('/api/users/register', async (req, res) => {
    try {
        // Extract user data from request body
        const { fullName, email, company, securityLevel, concerns, newsletter } = req.body;
        
        // SQL query to insert new user into database
        // Uses parameterized queries ($1, $2, etc.) to prevent SQL injection attacks
        const query = `
            INSERT INTO users (full_name, email, company, security_level, concerns, newsletter, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id, email
        `;
        
        // Execute the database query with user data
        const result = await pool.query(query, [fullName, email, company, securityLevel, concerns, newsletter]);
        
        // Send success response with user ID and email
        res.json({ success: true, user: result.rows[0] });
        
    } catch (error) {
        // Log error details for debugging
        console.error('Database error:', error);
        
        // Send error response to frontend
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

// USER LOGIN ENDPOINT
// Handles login attempts by checking if email exists in database
app.post('/api/users/login', async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;
        
        // SQL query to find user by email
        // Uses parameterized query for security
        const query = 'SELECT id, full_name, email, company, created_at FROM users WHERE email = $1';
        
        // Execute the database query
        const result = await pool.query(query, [email]);
        
        // Check if user was found
        if (result.rows.length > 0) {
            // User exists - send success response with user data
            res.json({ success: true, user: result.rows[0] });
        } else {
            // User not found - send failure response
            res.json({ success: false, error: 'No account found with this email' });
        }
        
    } catch (error) {
        // Log error details for debugging
        console.error('Login error:', error);
        
        // Send error response to frontend
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// CONTACT FORM ENDPOINT
// Handles form submissions from contact.html page
app.post('/api/contact', async (req, res) => {
    try {
        // Extract contact form data from request body
        const { name, email, company, phone, service, message } = req.body;
        
        // SQL query to insert contact inquiry into database
        // Uses parameterized queries for security
        const query = `
            INSERT INTO contact_inquiries (name, email, company, phone, service_interest, message, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
        `;
        
        // Execute the database query with contact form data
        const result = await pool.query(query, [name, email, company, phone, service, message]);
        
        // Send success response with inquiry ID
        res.json({ success: true, inquiryId: result.rows[0].id });
        
    } catch (error) {
        // Log error details for debugging
        console.error('Contact form error:', error);
        
        // Send error response to frontend
        res.status(500).json({ success: false, error: 'Failed to submit contact form' });
    }
});

// ============================================================================
// FRONTEND ROUTES
// ============================================================================

// Serve the homepage when someone visits the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

// Get port from environment variable or use default port 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'setup'}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 API Endpoints: /api/users/register, /api/users/login, /api/contact`);
});