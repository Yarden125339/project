const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'password', 
  database: 'project', 
});

db.connect((err) => {
  if (err) throw err;
  console.log('🔌 מחובר ל-MySQL');
});

module.exports = db;
