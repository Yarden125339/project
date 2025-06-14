const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'yarden',
  password: 'password', 
  database: 'projectdb', 
});

db.connect((err) => {
  if (err) throw err;
  console.log('🔌 מחובר ל-MySQL');
});

module.exports = db;
