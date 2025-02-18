// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected.');
});

// API endpoint to fetch all posts
app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY likes DESC';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// API endpoint to add a new post
app.post('/api/posts', (req, res) => {
  const { username, content, image } = req.body;
  const query = 'INSERT INTO posts (username, content, image, likes) VALUES (?, ?, ?, 0)';
  db.query(query, [username, content, image], (err, results) => {
    if (err) throw err;
    res.send({ message: 'Post created successfully.' });
  });
});

// API to like a post
app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: 'Post liked.' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
