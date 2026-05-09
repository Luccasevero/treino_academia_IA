import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Criamos um objeto de configuração para garantir que o banco seja apenas 'neondb'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL.split('?')[0], // Isso remove tudo depois do '?' automaticamente
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("Conectando ao banco...");

export default pool;