const router = require("express").Router();
const pool = require("../config/db");
const auth_middleware = require("../middlewares/auth_middleware");
const { encrypt, decrypt } = require("../encryption");

router.use(auth_middleware);

// GET /credentials - Devuelve todos los credenciales según el token AUTH
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_credential,
              service_name,
              account_username,
              url,
              notes,
              created_at,
              updated_at
       FROM CREDENTIALS
       WHERE id_user = $1`,
      [req.user.id_user],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener credenciales" });
  }
});

// POST /credentials - Crea nuevos credenciales de X sitio
router.post("/", async (req, res) => {
  try {
    const { service_name, account_username, password, url, notes } = req.body;

    const encryptedPassword = encrypt(password);

    const result = await pool.query(
      `INSERT INTO CREDENTIALS
       (id_user, service_name, account_username, password_encrypted, url, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id_credential, service_name, account_username, url, notes, created_at, updated_at`,
      [
        req.user.id_user,
        service_name,
        account_username,
        encryptedPassword,
        url,
        notes,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear credencial" });
  }
});

// GET /credentials/:id - Obtiene credencial según ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_credential,
              service_name,
              account_username,
              url,
              notes,
              created_at,
              updated_at
       FROM CREDENTIALS
       WHERE id_credential = $1
       AND id_user = $2`,
      [req.params.id, req.user.id_user],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener credencial" });
  }
});

// PUT /credentials/:id - Actualiza credencial
router.put("/:id", async (req, res) => {
  try {
    const { service_name, account_username, password, url, notes } = req.body;

    let encryptedPassword = null;

    if (password) {
      encryptedPassword = encrypt(password);
    }

    const result = await pool.query(
      `UPDATE CREDENTIALS
       SET service_name = $1,
           account_username = $2,
           password_encrypted = COALESCE($3, password_encrypted),
           url = $4,
           notes = $5,
           updated_at = NOW()
       WHERE id_credential = $6
       AND id_user = $7
       RETURNING id_credential, service_name, account_username, url, notes, created_at, updated_at`,
      [
        service_name,
        account_username,
        encryptedPassword,
        url,
        notes,
        req.params.id,
        req.user.id_user,
      ],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar credencial" });
  }
});

// DELETE /credentials/:id - Elimina credencial
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM CREDENTIALS
       WHERE id_credential = $1
       AND id_user = $2
       RETURNING id_credential`,
      [req.params.id, req.user.id_user],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });

    res.json({ message: "Eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar credencial" });
  }
});

// GET /credentials/:id/password - Revela contraseña desencriptada
router.get("/:id/password", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_credential, password_encrypted
       FROM CREDENTIALS
       WHERE id_credential = $1
       AND id_user = $2`,
      [req.params.id, req.user.id_user],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });

    const decryptedPassword = decrypt(result.rows[0].password_encrypted);

    await pool.query(
      `INSERT INTO AUDIT_LOGS
       (id_user, action, created_at, metadata)
       VALUES ($1, $2, NOW(), $3)`,
      [
        req.user.id_user,
        "SHOW_PASSWORD",
        JSON.stringify({
          credential_id: req.params.id,
          ip: req.ip,
          user_agent: req.headers["user-agent"],
        }),
      ],
    );

    res.json({ password: decryptedPassword });
  } catch (error) {
    res.status(500).json({ error: "Error al revelar contraseña" });
  }
});

module.exports = router;
