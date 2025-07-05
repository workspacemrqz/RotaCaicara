
# Site Testing and Monitoring Guide

Este guia detalha como testar e monitorar todas as funcionalidades do site Rota Caiçara.

## Scripts de Teste Disponíveis

### 1. Teste Completo do Site
```bash
npm run test
```
Executa um teste abrangente de todas as funcionalidades:
- ✅ Verificação de saúde do servidor
- ✅ Teste de APIs (categorias, empresas, configurações)
- ✅ Validação de estrutura de dados
- ✅ Teste de integridade dos dados
- ✅ Verificação de endpoints administrativos

### 2. Validação de Dados
```bash
node validate-data.js
```
Valida a estrutura e integridade dos dados:
- ✅ Campos obrigatórios presentes
- ✅ Relacionamentos entre tabelas
- ✅ Unicidade de slugs
- ✅ Formato de dados (email, URLs)

### 3. Monitoramento em Tempo Real
```bash
node monitor.js
```
Monitora continuamente a saúde do site:
- 👁️ Verificações de saúde a cada 30 segundos
- 📊 Tempo de resposta dos endpoints
- 💾 Uso de memória
- 🚨 Alertas automáticos para problemas

## Logs Implementados

### Backend (Server)
- **Requisições HTTP**: Todas as requisições são logadas com método, URL e dados
- **Operações de Banco**: Logs detalhados de consultas e operações
- **Validação de Dados**: Erros de validação são capturados e logados
- **Upload de Arquivos**: Status de uploads são monitorados

### Frontend (Client)
- **Chamadas de API**: Todas as requisições são logadas com resposta
- **Contexto de Configurações**: Carregamento e erros são monitorados
- **Painel Admin**: Validação de dados em tempo real

### Níveis de Log
- 🔵 **INFO**: Informações gerais
- ✅ **SUCCESS**: Operações bem-sucedidas
- ⚠️ **WARNING**: Avisos que não impedem funcionamento
- ❌ **ERROR**: Erros que precisam de atenção
- 🧪 **TEST**: Logs específicos de testes
- 👁️ **MONITOR**: Logs de monitoramento

## Como Interpretar os Logs

### Logs de Sucesso
```
[2024-01-05T10:30:00.000Z] ✅ SUCCESS: Categories API returned 14 categories
[2024-01-05T10:30:01.000Z] ✅ SUCCESS: All businesses have valid category relationships
```

### Logs de Aviso
```
[2024-01-05T10:30:02.000Z] ⚠️ WARNING: Business missing required fields
[2024-01-05T10:30:03.000Z] ⚠️ WARNING: 2 businesses have no contact information
```

### Logs de Erro
```
[2024-01-05T10:30:04.000Z] ❌ ERROR: Database connection failed
[2024-01-05T10:30:05.000Z] ❌ ERROR: Validation error in business registration
```

## Funcionalidades Testadas

### APIs Públicas
- ✅ `/api/categories` - Listagem de categorias
- ✅ `/api/categories/:slug` - Categoria específica
- ✅ `/api/businesses` - Listagem de empresas
- ✅ `/api/businesses/featured` - Empresas em destaque
- ✅ `/api/businesses/:id` - Empresa específica
- ✅ `/api/businesses/search` - Busca de empresas
- ✅ `/api/site-settings` - Configurações do site
- ✅ `/api/business-registrations` - Cadastro de empresas

### APIs Administrativas
- ✅ `/api/admin/business-registrations` - Gerenciar cadastros
- ✅ `/api/admin/businesses` - Gerenciar empresas
- ✅ `/api/admin/categories` - Gerenciar categorias
- ✅ `/api/admin/banners` - Gerenciar banners
- ✅ `/api/admin/settings` - Configurações administrativas
- ✅ `/api/admin/testimonials` - Depoimentos
- ✅ `/api/admin/faqs` - Perguntas frequentes
- ✅ `/api/admin/promotions` - Promoções
- ✅ `/api/admin/logs` - Logs administrativos
- ✅ `/api/admin/analytics` - Analíticas

### Validações de Dados
- ✅ Campos obrigatórios presentes
- ✅ Relacionamentos entre categorias e empresas
- ✅ Unicidade de slugs de categorias
- ✅ Formato de emails e URLs
- ✅ Empresas ativas têm informações de contato
- ✅ Configurações críticas do site presentes

## Troubleshooting

### Erro de Conexão com Banco
```bash
# Verificar se o banco está rodando
npm run dev
# Verificar logs do servidor
```

### Falhas em Testes de API
1. Verificar se o servidor está rodando na porta 5000
2. Confirmar que não há problemas de CORS
3. Validar estrutura dos dados no banco

### Problemas de Performance
1. Executar monitoramento: `node monitor.js`
2. Verificar uso de memória nos logs
3. Analisar tempo de resposta dos endpoints

## Automatização

Para executar todos os testes automaticamente:

```bash
# Teste completo
npm run test

# Teste com logs verbosos
npm run test:verbose

# Validação contínua
node monitor.js
```

## Relatórios de Teste

Os scripts geram relatórios detalhados no console com:
- ✅ Número de testes aprovados/reprovados
- 📊 Taxa de sucesso percentual
- 🔍 Detalhes específicos de cada falha
- 📈 Métricas de performance
- 💾 Uso de recursos

Para salvar logs em arquivo:
```bash
npm run test > test-results.log 2>&1
node monitor.js > monitoring.log 2>&1
```
