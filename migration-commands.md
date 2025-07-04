# Migração do Banco de Dados - Rota Caiçara

## Banco Antigo e Novo (mesmo banco)
postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable

## Comandos para Executar:

### 1. Fazer Backup
pg_dump "postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable" > backup_rotacaicara.sql

### 2. Verificar Tabelas Existentes
psql "postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable" -c "\dt"

### 3. Criar Novas Tabelas (executar no projeto)
npm run db:push

### 4. Inserir Dados Padrão
psql "postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable" -c "
INSERT INTO categories (name, slug, icon, active) VALUES
('PARA SUA REFEIÇÃO', 'para-sua-refeicao', '🍽️', true),
('PARA SUA CASA', 'para-sua-casa', '🏠', true),
('PARA SUA EMPRESA', 'para-sua-empresa', '🏭', true),
('PARA SUA SAÚDE', 'para-sua-saude', '💚', true),
('PARA SEU AUTOMÓVEL', 'para-seu-automovel', '🚗', true),
('PARA SUA BELEZA', 'para-sua-beleza', '💄', true),
('PARA SEU BEBÊ', 'para-seu-bebe', '👶', true),
('PARA SEU PET', 'para-seu-pet', '🐕', true),
('PARA SUA EDUCAÇÃO', 'para-sua-educacao', '✏️', true),
('PARA SEU CORPO', 'para-seu-corpo', '🏋️', true),
('PARA SUA FESTA', 'para-sua-festa', '🎂', true),
('PARA SUA VIAGEM', 'para-sua-viagem', '🏖️', true),
('PARA SUA DIVERSÃO', 'para-sua-diversao', '🎭', true),
('NOVIDADES NA CIDADE', 'novidades-na-cidade', '⭐', true)
ON CONFLICT (slug) DO NOTHING;
"

### 5. Testar Aplicação
npm run build
npm run start
