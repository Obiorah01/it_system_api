const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Get promise wrapper
const promisePool = pool.promise();

// Database preparation function
const prepareDatabase = async () => {
  let connection;

  try {
    console.log("🔧 Preparing database...");

    // Create connection without specifying database (use promise API)
    connection = await mysqlPromise.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Create database if it doesn't exist
    await connection.query("CREATE DATABASE IF NOT EXISTS support_system");
    console.log("✅ Database 'support_system' ready");

    // Use the database
    await connection.query("USE support_system");

    // Create faults table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS faults (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('incomplete', 'complete') DEFAULT 'incomplete',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTableSQL);
    console.log("✅ Table 'faults' ready");

    // Check if table is empty and add sample data
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM faults"
    );
    const count = rows[0].count;

    if (count === 0) {
      console.log("📝 Adding sample data...");
      const sampleData = [
        [
          "John Smith",
          "john.smith@wearview.edu",
          "Room 101",
          "Computer not turning on. Tried power button but no response. Monitor shows no signal.",
        ],
        [
          "Sarah Johnson",
          "sarah.johnson@wearview.edu",
          "Computer Lab A",
          'Printer showing "Paper Jam" error. Cleared visible paper but error persists.',
        ],
        [
          "Mike Wilson",
          "mike.wilson@wearview.edu",
          "Office Building - Floor 2",
          "WiFi connection keeps dropping. Can connect initially but loses connection after 5-10 minutes.",
        ],
        [
          "Lisa Brown",
          "lisa.brown@wearview.edu",
          "Library - Study Area",
          "Projector displaying distorted image. Colors are washed out and text is blurry.",
        ],
        [
          "David Lee",
          "david.lee@wearview.edu",
          "Conference Room B",
          "Video conferencing system not working. Camera shows black screen and microphone not picking up audio.",
        ],
      ];

      for (const data of sampleData) {
        await connection.query(
          "INSERT INTO faults (name, email, location, description) VALUES (?, ?, ?, ?)",
          data
        );
      }
      console.log("✅ Sample data added successfully");
    } else {
      console.log(`ℹ️  Table contains ${count} existing records`);
    }

    console.log("🎉 Database preparation completed successfully!");
  } catch (error) {
    console.error("❌ Database preparation failed:", error.message);
    console.log("🔧 Troubleshooting tips:");
    console.log("  1. Make sure MySQL server is running");
    console.log("  2. Check your MySQL credentials");
    console.log("  3. Ensure the MySQL user has CREATE privileges");

    if (error.code === "ECONNREFUSED") {
      console.log("💡 MySQL server might not be running. Start it first.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("💡 Check your MySQL username and password");
    }

    throw error; // Re-throw to prevent app from starting with broken database
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Test connection
const testConnection = async () => {
  try {
    const [rows] = await promisePool.execute("SELECT 1");
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database (runs preparation and test)
const initializeDatabase = async () => {
  try {
    await prepareDatabase();
    await testConnection();
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed");
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  prepareDatabase,
  initializeDatabase,
};
