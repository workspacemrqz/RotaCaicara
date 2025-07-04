
import { Pool } from 'pg';

async function reorderCategories() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não encontrada');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Conectando ao banco de dados...');
    await pool.connect();
    console.log('Conexão estabelecida com sucesso!');

    // Buscar todas as categorias ativas
    const { rows: categories } = await pool.query(`
      SELECT id, name, slug FROM categories 
      WHERE active = true 
      ORDER BY id
    `);

    console.log('Categorias encontradas:');
    categories.forEach(cat => console.log(`- ${cat.name} (id: ${cat.id})`));

    // Definir nova ordem: ASSISTÊNCIA TÉCNICA deve vir depois de PARA SEU AUTOMÓVEL
    const newOrder = [
      'para-sua-casa',
      'para-sua-refeicao', 
      'para-sua-empresa',
      'para-sua-saude',
      'para-sua-beleza',
      'para-seu-automovel',
      'assistencia-tecnica', // Movendo para depois de automóvel
      'para-seu-bebe',
      'para-seu-pet',
      'para-sua-educacao',
      'para-seu-corpo',
      'para-sua-festa',
      'para-sua-viagem',
      'novidades-na-cidade'
    ];

    console.log('\nReordenando categorias...');
    
    // Atualizar a ordem baseada no índice no array
    for (let i = 0; i < newOrder.length; i++) {
      const slug = newOrder[i];
      const orderValue = i + 1; // Começar do 1
      
      const result = await pool.query(`
        UPDATE categories 
        SET "order" = $1 
        WHERE slug = $2 
        RETURNING name, slug, "order"
      `, [orderValue, slug]);
      
      if (result.rows.length > 0) {
        console.log(`✓ ${result.rows[0].name} - ordem: ${result.rows[0].order}`);
      }
    }

    console.log('\nOrdem das categorias atualizada com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
    console.log('Conexão fechada.');
  }
}

reorderCategories();
