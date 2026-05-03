import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "treino_db",
    password: "23022006",
    port: 5432
});

export default pool;