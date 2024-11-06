const mysql = require('mysql2/promise');

// Define configurations for each shard
const profileDBConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'rootpass',
  database: 'user_profile_db',
};

const additionalInfoDBConfig = {
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'rootpass',
  database: 'user_additional',
};

// Insert user data across both shards
async function insertUser(user) {
  const { user_id, name, email, address, phone, preferences } = user;

  try {
    // Insert into User_Profile shard
    const profileConnection = await mysql.createConnection(profileDBConfig);
    await profileConnection.execute('INSERT INTO User_Profile (user_id, name, email) VALUES (?, ?, ?)', [
      user_id, name, email,
    ]);
    await profileConnection.end();

    // Insert into User_Additional_Info shard
    const additionalInfoConnection = await mysql.createConnection(additionalInfoDBConfig);
    await additionalInfoConnection.execute(
      'INSERT INTO User_Additional_Info (user_id, address, phone, preferences) VALUES (?, ?, ?, ?)',
      [user_id, address, phone, JSON.stringify(preferences)]
    );
    await additionalInfoConnection.end();

    console.log(`Inserted user with ID ${user_id} into both shards`);
  } catch (error) {
    console.error('Error inserting user:', error.message);
  }
}

// Retrieve user data from both shards and merge results
async function getUser(user_id) {
  try {
    // Fetch from User_Profile shard
    const profileConnection = await mysql.createConnection(profileDBConfig);
    const [profileRows] = await profileConnection.execute('SELECT * FROM User_Profile WHERE user_id = ?', [user_id]);
    await profileConnection.end();

    // Fetch from User_Additional_Info shard
    const additionalInfoConnection = await mysql.createConnection(additionalInfoDBConfig);
    const [additionalRows] = await additionalInfoConnection.execute('SELECT * FROM User_Additional_Info WHERE user_id = ?', [user_id]);
    await additionalInfoConnection.end();

    if (profileRows.length === 0 || additionalRows.length === 0) {
      console.log(`User with ID ${user_id} not found`);
      return null;
    }

    // Merge data from both shards
    const user = { ...profileRows[0], ...additionalRows[0] };
    console.log('Retrieved User:', user);
    return user;
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    return null;
  }
}

// Example usage
(async () => {
  const user = {
    user_id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    address: '123 Main St',
    phone: '123-456-7890',
    preferences: { theme: 'dark', notifications: true },
  };

  await insertUser(user);

  const retrievedUser = await getUser(1);
  console.log('User Data:', retrievedUser);
})();
