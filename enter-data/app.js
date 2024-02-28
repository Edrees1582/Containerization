const express = require('express');
const app = express();

const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  port: '3306',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Atypon#123',
  database: process.env.MYSQL_DATABASE || 'temps'
});

connection.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/readData', (req, res) => {
  connection.query(
    `SELECT * from temperatures;`,
    (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send(rows);
      }
    }
  );
});

app.get('/enterData', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/enterData', (req, res) => {
  const temps = req.body.tempInput.split(',').map((temp) => {
    return parseFloat(temp.trim());
  });

  temps.forEach((temp) => {
    connection.query(
      `INSERT INTO temperatures (temperature) VALUES (${temp});`,
      (err, rows, fields) => {
        if (err) {
          console.error('Error inserting temperature:', err);
        } else {
          console.log(rows);
          console.log('---------');
          console.log(fields);
          console.log('---------');
          console.log('Temperature inserted successfully:', temp);
        }
      }
    );
  });

  res.redirect('/enterData');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Enter Data services running on port: ' + PORT);
});
