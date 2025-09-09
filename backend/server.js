// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const app = express();

// PostgreSQL connection using environment variables
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'setup',
    password: process.env.DB_PASSWORD || 'Texas2Abuj@',
    port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// API endpoint for user registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { fullName, email, company, securityLevel, concerns, newsletter } = req.body;
        
        const query = `
            INSERT INTO users (full_name, email, company, security_level, concerns, newsletter, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id, email
        `;
        
        const result = await pool.query(query, [fullName, email, company, securityLevel, concerns, newsletter]);
        res.json({ success: true, user: result.rows[0] });
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, company, phone, service, message } = req.body;
        
        const query = `
            INSERT INTO contact_inquiries (name, email, company, phone, service_interest, message, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
        `;
        
        const result = await pool.query(query, [name, email, company, phone, service, message]);
        res.json({ success: true, inquiryId: result.rows[0].id });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit contact form' });
    }
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});