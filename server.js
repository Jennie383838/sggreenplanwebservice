const express = require('express');
const mysql = require('mysql2/promise');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const port = process.env.PORT || 3000;


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);
const app = express();

app.use(express.json());

// API Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15m
    max: 100, // 100 REQ Per IP
    message: {
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// GET all habits
app.get("/habits", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM ECOHabitTracker");
        res.json(rows);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ message: "Server error - could not fetch habits" });
    }
});

// POST a new habit
app.post("/addhabits", async (req, res) => {
    const { title, completed, points } = req.body;

    try {
        await pool.execute(
            "INSERT INTO ECOHabitTracker (Eco_title, Eco_completed, Eco_points) VALUES (?, ?, ?)",
            [title || 'New Habit', completed ? 1 : 0, points || 0]
        );
        res.status(201).json({ message: "Habit added successfully" });
    } catch (err) {
        console.error("POST Error:", err);
        res.status(500).json({ message: "Server error - could not add habit" });
    }
});

// PUT Update a habit
app.put("/updatehabits/:id", async (req, res) => {
    const { id } = req.params;
    const { title, completed, points } = req.body;

    try {
        const [result] = await pool.execute(
            "UPDATE ECOHabitTracker SET Eco_title = IFNULL(?, Eco_title), Eco_completed = IFNULL(?, Eco_completed), Eco_points = IFNULL(?, Eco_points) WHERE Eco_id = ?",
            [
                title || null, 
                completed !== undefined ? (completed ? 1 : 0) : null, 
                points !== undefined ? points : null, 
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit updated successfully" });
    } catch (err) {
        console.error("PUT Error:", err);
        res.status(500).json({ message: "Server error - could not update habit" });
    }
});

// DELETE a habit
app.delete("/deletehabits/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute("DELETE FROM ECOHabitTracker WHERE Eco_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Habit not found" });
        }

        res.json({ message: "Habit deleted successfully" });
    } catch (err) {
        console.error("DELETE Error:", err);
        res.status(500).json({ message: "Server error - could not delete habit" });
    }
});


app.listen(port, () => {
    console.log(`Eco Habit Tracker API started on port ${port}`);
});