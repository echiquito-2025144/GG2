import { Client, Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'gestion_gastos_db';

export async function inicializarBaseDeDatos() {
  // 1. Conexión a la base de datos predeterminada 'postgres'
  const clientRoot = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });

  try {
    await clientRoot.connect();

    // 2. Verificar si la base de datos existe
    const result = await clientRoot.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (result.rowCount === 0) {
      // Si no existe, la crea
      await clientRoot.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(` Base de datos '${DB_NAME}' creada exitosamente.`);
    }
  } catch (error) {
    console.error('Error al verificar/crear la base de datos:', error);
  } finally {
    await clientRoot.end();
  }

  // 3. Conexión a la base de datos del proyecto para crear las tablas
  const poolApp = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });

  try {
    await poolApp.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(20) DEFAULT 'USUARIO'
      );
    `);
    console.log(' Tablas creadas/verificadas correctamente.');
  } catch (error) {
    console.error('Error al crear tablas:', error);
  } finally {
    await poolApp.end();
  }
}