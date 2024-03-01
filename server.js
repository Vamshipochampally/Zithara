const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'root',
  port: 5433,
});

app.use(cors());

app.get('/api/customers', async (req, res) => {
  try {
    const query = `
    SELECT 
    sno, 
    customer_name, 
    age, 
    phone, 
    location, 
    TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
    TO_CHAR(created_at, 'HH24:MI:SS') AS time
FROM 
    customers
    `;
    const { rows } = await pool.query(query);

    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
