const express = require('express');
const app = express();

const mysql = require('mysql2');

const connection = mysql.createConnection({
  port: '3306',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Atypon#123',
  database: process.env.MYSQL_DATABASE || 'temps'
});

connection.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/auth-enter', (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}';`,
    (err, rows, fields) => {
      if (err) res.status(403);
      else {
        connection.query(`UPDATE users SET isLoggedIn = TRUE WHERE username = '${req.body.username}';`, (err, result) => {
          if (err) throw err;
        });
        res.redirect(`http://localhost:8001/enterData?username=${req.body.username}`);
      }
    }
  );
});

app.post('/auth-show', (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}';`,
    (err, rows, fields) => {
      if (err) res.status(403);
      else {
        console.log(`SELECT user: ${rows}`);
        connection.query(`UPDATE users SET isLoggedIn = TRUE WHERE username = '${req.body.username}';`, (err, result) => {
          if (err) throw err;
          else console.log(`UPDATE isLoggedIn: ${result}`);
        });
        res.redirect(`http://localhost:8003/showResults?username=${req.body.username}`);
      }
    }
  );
});

app.listen(8002, () => {
  console.log('Authentication service running on port: 8002');
});
