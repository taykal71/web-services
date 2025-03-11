const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Simulación de base de datos
const usersDb = {};

// Ruta para registrar un nuevo usuario
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  if (usersDb[username]) {
    return res.status(400).json({ message: "Usuario ya existe" });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  usersDb[username] = hashedPassword;

  return res.status(201).json({ message: "Registro exitoso" });
});

// Ruta para iniciar sesión
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario existe
  if (!usersDb[username]) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, usersDb[username]);
  if (isPasswordValid) {
    return res.status(200).json({ message: "Autenticación satisfactoria" });
  } else {
    return res.status(401).json({ message: "Error en la autenticación" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
