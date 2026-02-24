const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");
const credentialRoutes = require("./routes/credential");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.use("/auth", authRoutes);
app.use("/credentials", credentialRoutes);

module.exports = app;
