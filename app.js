const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const { initializeDatabase } = require("./db/connection");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database on startup
let dbInitialized = false;

const startServer = async () => {
  try {
    // Initialize database first
    console.log("🔧 Initializing database...");
    dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      console.error("❌ Failed to initialize database. Exiting...");
      process.exit(1);
    }

    // Start server only after database is ready
    app.listen(PORT, () => {
      console.log(`🎓 WearView Academy IT Support System`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Login credentials:`);
      console.log(`👩‍🏫 Staff: staffmember / letmein!123`);
      console.log(`👨‍💻 Technician: admin / heretohelp!456`);
      console.log(`⏰ Started at ${new Date().toLocaleString()}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: "wearview-academy-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).render("error", {
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    error: "Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

// Start the application
startServer();

module.exports = app;
