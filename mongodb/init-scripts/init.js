// Create a collection named "my_collection" in the "my_database" database
db.getSiblingDB('containerization').createCollection('temps');
db.getSiblingDB('containerization').createCollection('users');

// Insert initial data into the "my_collection" collection
db.getSiblingDB('containerization').users.insertMany([
  { username: 'edrees', password: '123' }
]);

// Print a message indicating the initialization is complete
print("Database initialization complete.");