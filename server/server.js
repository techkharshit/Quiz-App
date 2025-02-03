// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Install with npm install node-fetch

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Environment Variables
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'https://api.geneticsquiz.com/questions';

// Proxy Endpoint
app.get('/api/questions', async (req, res) => {
  try {
    // Fetch from external API
    const response = await fetch(EXTERNAL_API_URL);
    
    if (!response.ok) throw new Error(`External API error: ${response.statusText}`);
    
    // Get JSON data without storing
    const data = await response.json();
    
    // Send directly to client
    res.json({
      success: true,
      questions: data.questions
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch questions from external source'
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));