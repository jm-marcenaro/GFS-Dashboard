const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express app
const app = express();

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database('./DB/GFS-DB.db', (err) => {
    
    if (err) {
    
        console.error('Could not connect to database', err);
    
    } else {
    
        console.log('Connected to SQLite database');
    }
});

// Route to fetch data from the database
app.get('/data', (req, res) => {
    
    const query = `SELECT * FROM FCST`;

    db.all(query, [], (err, rows) => {
        
        if (err) {
            
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            data: rows
        });
    });
});

// Start the server
const PORT = 3000
app.listen(PORT, () => {
    
    console.log(`Proxy server running at http://localhost:${PORT}`);

});
