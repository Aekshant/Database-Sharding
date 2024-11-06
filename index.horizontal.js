const mysql = require('mysql2/promise');

// Define configurations for each shard
const shardConfigs = [
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootpass1',
    database: 'shard1_db',
  },
  {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'rootpass2',
    database: 'shard2_db',
  },
];

// Determine the shard based on user_id
function getShard(user_id) {
  return user_id % shardConfigs.length;
}

// Insert data into the appropriate shard
async function insertUser(user_id, name) {
  const shardIndex = getShard(user_id);
  const config = shardConfigs[shardIndex];
  
  try {
    const connection = await mysql.createConnection(config);
    await connection.execute('INSERT INTO users (user_id, name) VALUES (?, ?)', [user_id, name]);
    await connection.end();
    console.log(`Inserted user ${name} with ID ${user_id} into shard ${shardIndex + 1}`);
  } catch (error) {
    console.error('Error inserting user:', error.message);
  }
}

// Query data from the appropriate shard
async function getUser(user_id) {
  const shardIndex = getShard(user_id);
  const config = shardConfigs[shardIndex];
  
  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
    await connection.end();
    
    if (rows.length > 0) {
      return rows[0];
    } else {
      console.log(`User with ID ${user_id} not found in shard ${shardIndex + 1}`);
      return null;
    }
  } catch (error) {
    console.error('Error querying user:', error.message);
    return null;
  }
}

// Example usage
(async () => {
  await insertUser(1, 'Alice');
  await insertUser(2, 'Bob');

  const user1 = await getUser(1);
  const user2 = await getUser(2);

  console.log('Retrieved User 1:', user1);
  console.log('Retrieved User 2:', user2);
})();
