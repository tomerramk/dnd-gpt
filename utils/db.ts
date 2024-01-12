import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a pool using pg
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
