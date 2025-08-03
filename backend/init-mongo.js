// MongoDB initialization script
db = db.getSiblingDB('appp2p_auth');

// Create collections
db.createCollection('users');
db.createCollection('password_reset_tokens');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.password_reset_tokens.createIndex({ "token": 1 }, { unique: true });
db.password_reset_tokens.createIndex({ "email": 1 });
db.password_reset_tokens.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

print('Database appp2p_auth initialized successfully!');
print('Collections created: users, password_reset_tokens');
print('Indexes created for optimal performance');