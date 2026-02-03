require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const { exec } = require("child_process");
const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");

const git = simpleGit(path.join(__dirname, "../apps/course-assistant")); // Path to App B folder

// 1. Configure Middleware
app.use(cors());
app.use(express.json());

// 2. PostgreSQL Connection Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB Connection
pool.connect((err) => {
  if (err) {
    console.error("❌ Database connection error", err.stack);
  } else {
    console.log("✅ Connected to PostgreSQL");
  }
});

// 3. Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3001"], // App A and App B ports
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`📡 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 4. The "Save and Emit" Route
app.post("/save-code", async (req, res) => {
  const { filename, content } = req.body;

  try {
    // Insert into Postgres
    const query =
      "INSERT INTO code_snippets (filename, content) VALUES ($1, $2) RETURNING *";
    const values = [filename, content];
    const result = await pool.query(query, values);

    const savedSnippet = result.rows[0];

    // Emit the new data to all connected clients (App B will catch this)
    io.emit("new-code-arrival", savedSnippet);

    res.status(201).json({
      message: "Snippet saved and broadcasted!",
      data: savedSnippet,
    });
  } catch (err) {
    console.error("Error saving to DB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 5. Optional: Get all snippets (for App B initialization)
app.get("/snippets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM code_snippets ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.post("/run-pipeline", async (req, res) => {
  const { filename, content } = req.body;

  try {
    // STEP 1: COMPILATION CHECK (LINTING)
    // We'll use a simple regex check or try to write it to a temp file
    console.log("Stage 1: Linting...");
    io.emit("pipeline-log", "🔍 Linting code for syntax errors...");

    if (content.includes("import") && !content.includes("from")) {
      throw new Error("Syntax Error: Incomplete import statement.");
    }

    // STEP 2: DATABASE PERSISTENCE
    console.log("Stage 2: Saving to DB...");
    io.emit("pipeline-log", "💾 Saving to PostgreSQL...");
    await pool.query(
      "INSERT INTO code_snippets (filename, content) VALUES ($1, $2)",
      [filename, content],
    );

    // STEP 3: PUSH TO APP B REPOSITORY
    console.log("Stage 3: Updating App B Files...");
    io.emit("pipeline-log", "📂 Writing file to App B directory...");

    // Write the actual file into App B's source code
    const filePath = path.join(
      __dirname,
      `../apps/course-assistant/src/components/${filename}`,
    );
    fs.writeFileSync(filePath, content);

    console.log("Stage 4: Git Commit & Push...");
    io.emit("pipeline-log", "🚀 Committing and Pushing to Repository...");

    await git.add("./*");
    await git.commit(`Pipeline Update: ${filename}`);
    // await git.push('origin', 'main'); // Uncomment this if App B has a remote repo

    // STEP 4: FINAL NOTIFICATION
    io.emit("new-code-arrival", { filename, content }); // Real-time preview update
    io.emit("pipeline-log", "✅ Pipeline Complete! App B is now in sync.");

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    io.emit("pipeline-log", `❌ Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});
