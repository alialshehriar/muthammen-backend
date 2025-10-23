import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Time:', result.rows[0].now);
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

test();
