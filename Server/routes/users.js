const express = require('express');
const db = require('../db');
const router = express.Router();

// רישום
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
db.query(sql, [username, email, password], (err, result) => {
  if (err) {
    console.error('Database Error:', err); // Log full error details
    return res.status(500).json({ error: 'שגיאה ביצירת משתמש' });
  }

  const Sql = 'SELECT * FROM users WHERE id = ?';

db.query(Sql, [result.insertId], async (Err, Results) => {
  if (Err || Results.length === 0) return res.status(401).json({ error: 'משתמש לא נמצא' });

  const user = Results[0];
  console.log('User created:', user); // Log successful creation

  res.json({ message: 'משתמש נוצר בהצלחה', userId: user.id, username: user.username });

});
});


});

// התחברות
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'משתמש לא נמצא' });

    const user = results[0];

    if (password==user.password) {
      res.json({ message: 'התחברת בהצלחה', userId: user.id, username: user.username });
    } else {
      res.status(401).json({ error: 'סיסמה שגויה' });
    }
  });
});

module.exports = router;
