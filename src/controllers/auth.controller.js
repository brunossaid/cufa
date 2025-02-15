import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const errors = {};

    // verificar si el email ya esta registrado
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      errors.email = "Email already exists";
    }

    // verificar si el username ya esta registrado
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      errors.username = "Username is taken";
    }

    // si hay errores, devolverlos todos juntos
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // cifrar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // crear usuario
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // guardar usuario en la bd
    const userSaved = await newUser.save();
    console.log("userSaved (auth.controller):", userSaved);

    // generar token
    const token = createAccessToken({ id: userSaved._id });

    // crear respuesta
    const userResponse = {
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    };

    // establecer token como cookie
    res.cookie("token", token);

    // enviar respuesta json al cliente
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const errors = {};

    // verificar si el usuario existe
    const userFound = await User.findOne({ username });
    if (!userFound) {
      errors.username = "User not found";
    }

    // verificar si la contraseña es correcta
    if (userFound) {
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) {
        errors.password = "Incorrect password";
      }
    }

    // si hay errores, devolverlos todos juntos
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // generar token
    const token = await createAccessToken({ id: userFound._id });

    // establecer token como cookie
    res.cookie("token", token);

    // enviar datos del usuario
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });

  res.send("profile");
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("HOLAA");

  try {
    // buscar usuario
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // actualizar datos, si estan presentes
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // encriptar

    // guardar
    await user.save();

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // cifrar la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // actualizar la contraseña en db
    userFound.password = newPasswordHash;
    await userFound.save();

    return res.status(200).json({
      message: "Password updated successfully",
      user: {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
