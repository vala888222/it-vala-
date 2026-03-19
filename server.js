const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            service TEXT,
            message TEXT,
            date timestamp DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            category TEXT,
            description TEXT,
            image TEXT,
            link TEXT
        )`);
    }
});

// API Routes
// 1. Submit Contact Form
app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body;
    db.run(`INSERT INTO contacts (name, email, service, message) VALUES (?, ?, ?, ?)`, 
        [name, email, service, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: this.lastID, success: true });
    });
});

// 2. Get All Contacts (Admin)
app.get('/api/contacts', (req, res) => {
    db.all(`SELECT * FROM contacts ORDER BY date DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// 3. Delete Contact (Admin)
app.delete('/api/contacts/:id', (req, res) => {
    db.run(`DELETE FROM contacts WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ success: true, deletedID: req.params.id });
    });
});

// 4. Get Projects (Admin & Frontend)
app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// 5. Add Project (Admin)
app.post('/api/projects', (req, res) => {
    const { title, category, description, image, link } = req.body;
    db.run(`INSERT INTO projects (title, category, description, image, link) VALUES (?, ?, ?, ?, ?)`, 
        [title, category, description, image, link], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: this.lastID, success: true });
    });
});

// 6. Delete Project (Admin)
app.delete('/api/projects/:id', (req, res) => {
    db.run(`DELETE FROM projects WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ success: true, deletedID: req.params.id });
    });
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
