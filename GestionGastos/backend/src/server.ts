import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import { verificarToken, esAdmin } from './shared/auth.middleware';
import { inicializarBaseDeDatos } from './config/initDb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas del Módulo de Autenticación
app.use('/api/auth', authRoutes);

// Ruta de prueba protegida
app.get('/api/perfil', verificarToken, (req, res) => {
  const usuario = (req as any).usuario;
  res.json({ mensaje: `Sesión activa para ${usuario.email}`, usuario });
});

// Ruta exclusiva para Administradores
app.get('/api/admin/dashboard', verificarToken, esAdmin, (req, res) => {
  res.json({ mensaje: 'Bienvenido al panel exclusivo de Administrador' });
});

// Inicialización de Base de Datos y arranque del servidor
inicializarBaseDeDatos()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al inicializar el servidor:', error);
  });