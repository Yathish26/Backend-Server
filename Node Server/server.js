const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("data.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Create the table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS Data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        }
      }
    );
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js Backend Server with Database!" });
});

// POST endpoint to save data
app.post("/api/data", (req, res) => {
  const { name, age } = req.body;

  // Validate input
  if (!name || typeof age !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }

  // Save to the database
  const query = "INSERT INTO Data (name, age) VALUES (?, ?)";
  db.run(query, [name, age], function (err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ error: "Failed to save data" });
    }

    res.json({
      message: "Data saved successfully!",
      saved_data: { id: this.lastID, name, age },
    });
  });
});

// GET endpoint to retrieve all data
app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM Data";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
