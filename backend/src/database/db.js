import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config(); 

// Se DATABASE_URL estiver vazia, o código vai avisar no log em vez de tentar conectar no localhost
if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO: A variável DATABASE_URL não foi detectada!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

export default pool;