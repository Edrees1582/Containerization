const express = require('express');
const app = express();
const session = require('express-session');

const mysql = require('mysql2');

const connection = mysql.createConnection({
  port: '3306',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Atypon#123',
  database: process.env.MYSQL_DATABASE || 'temps'
});

connection.connect();

app.use(session({
  secret: 'somerandomsecretkey@$534634',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/enterData', async (req, res) => {
  if (req.query.username) {
    connection.query(
      `SELECT * FROM users where username = '${req.query.username}';`,
      (err, rows, fields) => {
        if (err) throw err;
        else if (rows.length == 0) res.redirect('/');
      }
    );

    connection.query(
      `SELECT isLoggedIn FROM users where username = '${req.query.username}';`,
      (err, rows, fields) => {
        if (err) throw err;
        else if (rows.length == 0) res.redirect('/');
        else {
          if (rows[0].isLoggedIn == 1) {
            req.session.isLoggedIn = 1;
            req.session.username = req.query.username;
            res.sendFile(__dirname + '/index.html');
          }
          else res.redirect('/');
        }
      }
    );
  } else {
    res.redirect('/');
  }
});

app.post('/enterData', async (req, res) => {
  if (req.session.isLoggedIn == 1) {
    const temps = req.body.tempInput.split(',').map((temp) => {
      return parseFloat(temp.trim());
    });

    temps.forEach((temp) => {
      connection.query(
        `INSERT INTO temperatures (temperature) VALUES (${temp});`,
        (err, rows, fields) => {
          if (err)
            console.error('Error inserting temperatures:', err);
          else
            console.log('Temperatures inserted successfully:', temp);
        }
      );
    });

    connection.query(
      `UPDATE users SET isLoggedIn = '0' WHERE username = '${req.session.username}';`,
      (err, result) => {
        if (err) throw err;
        else req.session.isLoggedIn = 0;
      }
    );
    let username = req.session.username;
    req.session.username = '';
    res.redirect(`/enterData?username${username}`);
  } else {
    res.redirect('/');
  }
});

app.listen(8001, () => {
  console.log('Enter Data service running on port: 8001');
});
