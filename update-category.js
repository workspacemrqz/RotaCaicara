
const { Pool } = require('pg');

async function updateCategory() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not configured");
    return;
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    await pool.query(`
      UPDATE categories 
      SET name = 'ASSISTÊNCIA TÉCNICA', 
          slug = 'assistencia-tecnica',
          icon = '🔧'
      WHERE name = 'PARA SUA DIVERSÃO' OR slug = 'para-sua-diversao'
    `);
    
    console.log('Categoria atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
  } finally {
    await pool.end();
  }
}

updateCategory();
