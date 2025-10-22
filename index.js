import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const pool = mysql.createPool(process.env.DATABASE_URL + "?ssl={" + JSON.stringify({rejectUnauthorized:false}) + "}");

// CREATE TABLE (run once manually)
// await pool.query("CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))");

// CRUD
app.get("/users", async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email]
  );
  res.json({ id: result.insertId, name, email });
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await pool.query("UPDATE users SET name=?, email=? WHERE id=?", [
    name,
    email,
    id,
  ]);
  res.json({ id, name, email });
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id=?", [id]);
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, () => console.log("MySQL API running 🚀"));
