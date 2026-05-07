import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config(); // Garante que as variáveis de ambiente sejam carregadas

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false // Isso é obrigatório para bancos na nuvem como o Neon
  }
});

export default pool;