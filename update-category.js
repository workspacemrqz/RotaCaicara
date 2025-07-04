
const { Pool } = require('pg');

async function updateCategory() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL não configurada. Configure nos Secrets do Replit:");
    console.error("Chave: DATABASE_URL");
    console.error("Valor: postgresql://usuario:senha@host:porta/database");
    return;
  }

  console.log("Conectando ao banco de dados...");
  
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Teste a conexão
    await pool.query('SELECT 1');
    console.log("Conexão estabelecida com sucesso!");

    // Verificar se a categoria existe
    const checkResult = await pool.query(`
      SELECT id, name, slug, icon 
      FROM categories 
      WHERE name = 'PARA SUA DIVERSÃO' OR slug = 'para-sua-diversao'
    `);

    if (checkResult.rows.length === 0) {
      console.log("Categoria 'PARA SUA DIVERSÃO' não encontrada.");
      return;
    }

    console.log("Categoria encontrada:", checkResult.rows[0]);

    // Atualizar a categoria
    const updateResult = await pool.query(`
      UPDATE categories 
      SET name = 'ASSISTÊNCIA TÉCNICA', 
          slug = 'assistencia-tecnica',
          icon = '🔧'
      WHERE name = 'PARA SUA DIVERSÃO' OR slug = 'para-sua-diversao'
      RETURNING *
    `);
    
    if (updateResult.rows.length > 0) {
      console.log('Categoria atualizada com sucesso!');
      console.log('Nova categoria:', updateResult.rows[0]);
    } else {
      console.log('Nenhuma categoria foi atualizada.');
    }
    
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await pool.end();
    console.log("Conexão fechada.");
  }
}

updateCategory();
