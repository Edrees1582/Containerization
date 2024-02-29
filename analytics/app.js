const express = require('express');
const app = express();

const mysql = require('mysql2');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb://root:${encodeURIComponent("Atypon#123")}@mongodb:27017`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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

app.get('/analytics', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/analytics', (req, res) => {
  async function run() {
    try {
      await client.connect();
      db = client.db("containerization");
  
      await db.command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
  
      const analytics = db.collection('analytics');

      connection.query(
        'SELECT MAX(temperature) as maxTemperature, AVG(temperature) as avgTemperature, MIN(temperature) as minTemperature FROM temperatures;',
        async (err, rows, fields) => {
          if (err) throw err;
          else {
            await analytics.deleteOne({ maxTemperature: { $exists: true } });
            await analytics.deleteOne({ avgTemperature: { $exists: true } });
            await analytics.deleteOne({ minTemperature: { $exists: true } });
            
            await analytics.insertOne({ maxTemperature: rows[0].maxTemperature });
            await analytics.insertOne({ avgTemperature: rows[0].avgTemperature });
            await analytics.insertOne({ minTemperature: rows[0].minTemperature });

            res.redirect('http://localhost:8003');
          }
        }
      );
    } finally {}
  }
  run().catch(console.dir);
});

app.listen(8004, () => {
  console.log('Analytics service running on port: 8004');
});
