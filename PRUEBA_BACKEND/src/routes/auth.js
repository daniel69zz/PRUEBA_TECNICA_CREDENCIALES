const router = require("express").Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//POST /auth/register  FUNCIONA
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y password requeridos" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO USERS (email, password_hash, created_at)
       VALUES ($1, $2, NOW())`,
      [email, hashed],
    );

    res.status(201).json({ message: "Usuario creado" });
  } catch (error) {
    console.error("ERROR REAL:", error); // ← agrega esta línea

    if (error.code === "23505") {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    res.status(500).json({ error: "Error al registrar" });
  }
});

//POST /auth/login FUNCIONA
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id_user, email, password_hash
       FROM USERS
       WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Credenciales inválidas" });

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

module.exports = router;
