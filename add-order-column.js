
import { Pool } from 'pg';

async function addOrderColumn() {
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

    // Adicionar a coluna "order" se ela não existir
    console.log('Adicionando coluna "order" na tabela categories...');
    await pool.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0
    `);

    console.log('✓ Coluna "order" adicionada com sucesso!');
    
    // Definir ordem inicial baseada no ID para manter ordem atual
    console.log('Definindo ordem inicial...');
    await pool.query(`
      UPDATE categories 
      SET "order" = id 
      WHERE "order" = 0 OR "order" IS NULL
    `);

    console.log('✓ Ordem inicial definida!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
    console.log('Conexão fechada.');
  }
}

addOrderColumn();
