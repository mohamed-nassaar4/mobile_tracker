import { Pool } from "pg";
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "nassaar",
    port: 5432,
});
export default pool;