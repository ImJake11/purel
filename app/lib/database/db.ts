import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
    path: "local.env"
});

console.log(process.env.DB_CONNECTION);

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION,
})

export default pool;