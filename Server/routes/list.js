
const express = require('express');
const db = require('../db'); // MySQL connection
const router = express.Router();

// Get all teams
router.get('/', (req, res) => {
    db.query('SELECT * FROM teams', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching teams' });
        res.json(results);
    });
});

// Add a new team
router.post('/', (req, res) => {
    const { name, userId } = req.body;
    console.log("User ID:", userId); // Debugging line to check userId
    db.query('INSERT INTO teams (name, user_id) VALUES (?, ?)', [name, userId], (err, result) => {
        if (err) {
          console.error('Error inserting team:', err);
          return res.status(500).json({ error: 'Error adding team' });
        }
        res.json({ message: 'Team added successfully', id: result.insertId });
    });
});

// Delete a team
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM teams WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error deleting team' });
        res.json({ message: 'Team deleted successfully' });
    });
});

router.put('/:id', (req, res) => {
  const { field, value } = req.body;
  if (!['name', 'top', 'jungle', 'mid', 'bottom', 'support'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
  }
  db.query(`UPDATE teams SET ${field} = ? WHERE id = ?`, [value, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: 'Error updating team' });
      res.json({ message: 'Team updated successfully' });
  });
});

module.exports = router;
