const express = require('express');
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
// ${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD} Atypon#123
const uri = `mongodb://root:${encodeURIComponent("Atypon#123")}@mongodb:27017`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Testing CI/CD

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
})

app.get('/showResults', (req, res) => {
  if (req.query.username) {
    connection.query(
      `SELECT * FROM users where username = '${req.query.username}';`,
      (err, rows, fields) => {
        if (err) throw err;
        else if (rows.length == 0) res.redirect('/');
        else {
          if (rows[0].isLoggedIn == 1) {
            async function run() {
              try {
                await client.connect();
                db = client.db("containerization");
            
                await db.command({ ping: 1 });
                console.log("You successfully connected to MongoDB!");
            
                const analytics = db.collection('analytics');
        
                const analyticsResult = await analytics.find({}).toArray();
                console.log('Analytics result: ', analyticsResult);
  
                connection.query(
                  `UPDATE users SET isLoggedIn = '0' WHERE username = '${req.query.username}';`,
                  (err, result) => {
                    if (err) throw err;
                  }
                );
  
                res.send(analyticsResult)
              } finally {}
            }
            run().catch(console.dir);
          }
          else res.redirect('/');
        }
      }
    );
  } else {
    res.redirect('/');
  }
});

app.listen(8003, () => {
  console.log('Show Results service running on port: 8003');
});
