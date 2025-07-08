// server.js
const express = require('express');
const { Pool } = require('pg');
const app = express();

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'setup',
    password: 'Texas2Abuj@',
    port: 5432,
});

app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});