# Guia de Deploy - Rota Caiçara no EasyPanel

## Resumo das Correções Implementadas

### ✅ Problemas Resolvidos:
1. **Sintaxe Nixpacks**: Configuração corrigida para formato adequado
2. **Dependências npm**: Incluído `--include=dev` para instalar devDependencies
3. **Vite não encontrado**: Corrigido com instalação das devDependencies
4. **Seed do banco**: Tornado opcional para não quebrar o deploy
5. **Configuração do servidor**: Porta dinâmica e bind em 0.0.0.0

## Configuração no EasyPanel

### 1. Criar Novo Projeto
- Acesse seu painel do EasyPanel
- Clique em "New Project"
- Selecione "From GitHub"

### 2. Configuração do Repositório
- **Repository**: `workspacemrqz/RotaCaicara`
- **Branch**: `main`
- **Build Type**: `Nixpacks`

### 3. Configuração das Variáveis de Ambiente
**IMPORTANTE**: Configure estas variáveis no EasyPanel:

```bash
NODE_ENV=production
PORT=3101
DATABASE_URL=postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable
```

### 4. Configuração do Banco de Dados
Se você ainda não configurou o banco PostgreSQL no EasyPanel:

1. **Crie um serviço PostgreSQL**:
   - Vá em "Services" → "Database" → "PostgreSQL"
   - Nome: `postgres_rotacaicara`
   - Usuário: `mrqz`
   - Senha: `@Workspacen8n`
   - Database: `rotacaicara`

2. **Configure a URL de conexão**:
   - A URL deve ser: `postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable`
   - **Nota**: Use o nome interno do serviço PostgreSQL (`postgres_rotacaicara`)

### 5. Configuração Avançada
- **Health Check**: `/health` (opcional)
- **Port**: `3101`
- **Build Command**: Deixe vazio (usa nixpacks.toml)
- **Start Command**: Deixe vazio (usa nixpacks.toml)

### 6. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Verifique os logs para confirmar que o servidor iniciou

## Configuração Nixpacks Final

O arquivo `nixpacks.toml` está configurado com:

```toml
# Configuração Nixpacks para EasyPanel
[variables]
NODE_ENV = "production"
PORT = "3101"

[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
dependsOn = ["setup"]
cmds = ["npm ci --include=dev"]

[phases.build] 
dependsOn = ["install"]
cmds = ["npm run build"]

[phases.start]
dependsOn = ["build"]
cmds = ["npm run start"]
```

## Estrutura do Projeto

```
Rota/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas compartilhados
├── dist/            # Build output
├── nixpacks.toml    # Configuração de deploy
└── package.json     # Dependências
```

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Linting
npm run lint
```

## Healthcheck

O servidor expõe um endpoint de saúde em:
- `GET /health`
- Retorna: `{"status": "ok", "timestamp": "..."}`

## Solução de Problemas

### Erro de Conexão com Banco
Se o erro `EAI_AGAIN postgres_rotacaicara` aparecer:
1. Verifique se o serviço PostgreSQL está rodando
2. Confirme que a variável `DATABASE_URL` está configurada corretamente
3. O seed do banco agora é opcional e não deve quebrar o deploy

### Erro de Build
Se o Vite não for encontrado:
1. Confirme que `--include=dev` está no comando de instalação
2. Verifique se as devDependencies estão listadas no package.json

### Erro de Porta
Se o servidor não responder:
1. Confirme que a variável `PORT=3101` está configurada
2. Verifique se não há conflitos de porta

## Logs de Deploy

Durante o deploy, você deve ver:
1. ✅ Download do código do GitHub
2. ✅ Instalação das dependências (`npm ci --include=dev`)
3. ✅ Build do projeto (`npm run build`)
4. ✅ Início do servidor (`npm run start`)

## Último Commit

```
fix: tornar seed do banco opcional para não quebrar deploy
```

**Status**: ✅ Pronto para deploy
**Data**: 2025-01-04 