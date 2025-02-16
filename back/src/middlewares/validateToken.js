import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // guardar datos del usuario autenticado
    next(); // continuar al siguiente middleware/controlador
  });
};
