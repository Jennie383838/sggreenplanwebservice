// include required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const port = 3000;

// database config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => console.log(`Server started on port ${port}`));

// ROUTES FOR HABITS

// GET all habits
app.get("/habits", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM habits ORDER BY id");
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error - could not fetch habits" });
    }
});

// POST a new habit
app.post("/habits", async (req, res) => {
    const { title, completed, points } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            "INSERT INTO habits (title, completed, points) VALUES (?, ?, ?)",
            [title, completed || false, points || 0]
        );
        await connection.end();
        res.status(201).json({ message: "Habit added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error - could not add habit" });
    }
});

// PUT to update a habit
app.put("/habits/:id", async (req, res) => {
    const { id } = req.params;
    const { title, completed, points } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            "UPDATE habits SET title = ?, completed = ?, points = ? WHERE id = ?",
            [title, completed, points, id]
        );
        await connection.end();
        res.json({ message: "Habit updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error - could not update habit" });
    }
});

// DELETE a habit
app.delete("/habits/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute("DELETE FROM habits WHERE id = ?", [id]);
        await connection.end();
        res.json({ message: "Habit deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error - could not delete habit" });
    }
});

// start server
app.listen(port, () => {
    console.log("Eco Habit Tracker API started on port " + port);
});
