# Guia de Deploy EasyPanel - Rota Caiçara

## Problemas Corrigidos ✅

1. **Erro de sintaxe no nixpacks.toml** - Corrigido
2. **Porta hardcoded no servidor** - Corrigido para usar variável de ambiente
3. **Endpoint de health check** - Adicionado
4. **Configuração de CORS** - Verificada

## Configuração no EasyPanel

### 1. Criar Nova Aplicação
- **Nome**: rotacaicara
- **Tipo**: App
- **Fonte**: GitHub Repository
- **Repositório**: https://github.com/workspacemrqz/RotaCaicara
- **Branch**: main
- **Tipo de Build**: Nixpacks

### 2. Configuração do Nixpacks

#### Comandos (deixar vazios - usar nixpacks.toml):
- **Comando de Instalação**: (vazio)
- **Comando de Build**: (vazio)
- **Comando de Início**: (vazio)

#### Pacotes:
- **Pacotes Nix**: (vazio - configurado no nixpacks.toml)
- **Pacotes APT**: (vazio)

### 3. Variáveis de Ambiente

```env
DATABASE_URL=postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable
NODE_ENV=production
PORT=3101
```

### 4. Configuração de Rede
- **Porta**: 3101
- **Health Check**: `/health`
- **Health Check Timeout**: 30s
- **Health Check Interval**: 30s

### 5. Configuração de Domínio
- Configure o domínio desejado nas configurações de routing

## Arquivos Corrigidos

### nixpacks.toml
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

### server/index.ts
- Porta alterada para usar `process.env.PORT`
- Endpoint `/health` adicionado
- Host configurado para `0.0.0.0`

## Processo de Deploy

### 1. Primeiro Deploy
```bash
# Fazer push das correções
git add .
git commit -m "fix: corrigir configuração para deploy EasyPanel"
git push origin main
```

### 2. Configurar Banco de Dados
Após o primeiro deploy bem-sucedido, execute:

```bash
# Conectar à aplicação via SSH ou console
npm run db:push
```

### 3. Verificar Funcionamento
- **Health Check**: `https://seu-dominio.com/health`
- **Site Principal**: `https://seu-dominio.com`

## Monitoramento

### Logs
- Monitore os logs para verificar se a aplicação está iniciando corretamente
- Verifique se não há erros de conexão com o banco

### Métricas
- CPU e memória usage
- Tempo de resposta
- Uptime

## Troubleshooting

### ❌ Erro: "undefined variable 'npm'"
**Solução**: Removido `npm` dos nixPkgs pois já vem incluído no `nodejs_20`

### ❌ Erro: "invalid type: map, expected a sequence"
**Solução**: Corrigida sintaxe do nixpacks.toml

### ❌ Erro: "sh: 1: vite: not found"
**Solução**: Alterado comando de instalação para `npm ci --include=dev` para incluir devDependencies

### Erro de Banco de Dados
```bash
# Verificar conexão
psql "postgres://mrqz:@Workspacen8n@postgres_rotacaicara:5432/rotacaicara?sslmode=disable" -c "\dt"
```

### Erro de Build
- Verificar se todas as dependências estão instaladas
- Verificar sintaxe do nixpacks.toml
- Verificar se os scripts npm estão funcionando

### Erro de Porta
- Verificar se a variável PORT está definida
- Verificar se o servidor está bind em 0.0.0.0

## Configurações Avançadas

### SSL/TLS
- EasyPanel gerencia automaticamente certificados SSL
- Configure redirect HTTP para HTTPS se necessário

### Backup
- Configure backups automáticos do banco de dados
- Monitore espaço em disco

### Escalonamento
- Configure auto-scaling se necessário
- Monitore performance e recursos

## Comandos Úteis

### Restart da Aplicação
```bash
# No EasyPanel: usar botão Restart
```

### Verificar Logs
```bash
# No EasyPanel: aba Logs
```

### Acessar Console
```bash
# No EasyPanel: botão Console
```

## Checklist Final

- [ ] nixpacks.toml corrigido
- [ ] Porta configurada corretamente
- [ ] Variáveis de ambiente definidas
- [ ] Health check endpoint funcionando
- [ ] Banco de dados configurado
- [ ] SSL/TLS ativo
- [ ] Domínio configurado
- [ ] Monitoramento ativo
- [ ] Backups configurados 