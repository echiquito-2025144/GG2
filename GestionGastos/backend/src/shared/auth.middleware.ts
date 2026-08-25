import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    (req as any).usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};

export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
  const usuario = (req as any).usuario;

  if (!usuario || usuario.rol !== 'ADMIN') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de Administrador.' });
  }

  next();
};