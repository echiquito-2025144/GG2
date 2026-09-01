import { pool } from '../../config/database';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

export class AuthService {
  static async login(email: string, passwordPlana: string) {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new Error('Credenciales incorrectas');
    }

    const usuario = result.rows[0];

    const esValida = await bcrypt.compare(passwordPlana, usuario.password);
    if (!esValida) {
      throw new Error('Credenciales incorrectas');
    }

    const secret = process.env.JWT_SECRET || 'secret';

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      secret,
      { expiresIn: '2m' } //  Expira en 2 minutos
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  }

  static async register(nombre: string, email: string, passwordPlana: string) {
    const usuarioExistente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(passwordPlana, saltRounds);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, passwordEncriptada, 'USUARIO']
    );

    const nuevoUsuario = result.rows[0];

    const secret = process.env.JWT_SECRET || 'secret';

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      secret,
      { expiresIn: '2m' } //  Expira en 2 minutos
    );

    return {
      token,
      usuario: nuevoUsuario
    };
  }
}