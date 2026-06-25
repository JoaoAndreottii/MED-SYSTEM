# Railway Setup Guide

Railway **provisiona serviços via Dashboard**, não via arquivo config.

## ✅ Passo 1: Criar Projeto no Railway

1. Vá para https://railway.app
2. Clique **"Create New Project"**
3. Selecione **"Deploy from GitHub"**
4. Conecte seu repo `med-system`
5. Clique **"Deploy"**

## ✅ Passo 2: Adicionar PostgreSQL

1. No dashboard do projeto, clique **"+ Add Service"**
2. Selecione **"PostgreSQL"**
3. Railway vai provisionar automaticamente
4. Copie `DATABASE_URL` (será injetada automaticamente)

## ✅ Passo 3: Adicionar Redis

1. Clique **"+ Add Service"**
2. Selecione **"Redis"**
3. Railway vai provisionar automaticamente
4. Copie `REDIS_HOST` e `REDIS_PORT` (será injetado automaticamente)

## ✅ Passo 4: Configurar Variáveis de Ambiente

No dashboard do seu **API Service**, vá para **"Variables"** e adicione:

```
JWT_SECRET=<gere-uma-chave-de-32-caracteres>
NODE_ENV=production
LOG_LEVEL=info
QUEUE_CONCURRENCY=5
QUEUE_MAX_RETRIES=3
QUEUE_RETRY_DELAY_MS=5000
JWT_EXPIRES_IN=24h
APP_NAME=Med-System
PORT=3000
```

**Automáticas (Railway injeta):**
- `DATABASE_URL` — PostgreSQL
- `REDIS_HOST` — Redis hostname
- `REDIS_PORT` — Redis port

## ✅ Passo 5: Deploy

1. Volte para **"Deployments"**
2. Clique **"Trigger Deploy"** (botão ▶)
3. Aguarde o build completar (5-10 min)
4. Monitore em **"Logs"**

## ✅ Passo 6: Executar Migrations

Após deployment bem-sucedido:

```bash
railway run npm run prisma:migrate
```

Ou via Railway Dashboard:
1. Selecione o serviço **API**
2. Clique **"Terminal"** (ou similar)
3. Execute: `npm run prisma:migrate`

## ✅ Passo 7: Verificar

```bash
# Testar health check
curl https://seu-app.up.railway.app/health

# Deve retornar:
# {
#   "status": "ok",
#   "timestamp": "2026-06-25T...",
#   "uptime": 123.45,
#   ...
# }
```

---

## 📋 Railway Dashboard Checklist

- [ ] Projeto criado
- [ ] PostgreSQL adicionado e rodando
- [ ] Redis adicionado e rodando
- [ ] Variáveis de ambiente configuradas
- [ ] Deployment triggered e bem-sucedido
- [ ] Migrations executadas
- [ ] Health check respondendo

---

## 🔗 Links Úteis

- **Railway Dashboard:** https://railway.app/dashboard
- **Your Project:** https://railway.app/project/[ID]
- **Docs:** https://docs.railway.app

---

## ❌ Troubleshooting

### Build falha?
1. Verifique logs em **Deployments**
2. Procure por "error" ou "failed"
3. Comum: node_modules não instalado
4. Solução: `npm install` antes de build

### Database connection failed?
1. Verifique `DATABASE_URL` está definida
2. Confirme PostgreSQL está rodando
3. Execute: `railway run npm run prisma:migrate`

### Variáveis não aparecem?
1. Vá em **API Service** → **Variables**
2. Adicione manualmente (não automático)
3. Salve e redeploy

### App não inicia?
1. Verifique em **Logs**
2. Procure por erros de conexão (DB, Redis)
3. Confirme `PORT=3000` está definido

---

## 🎯 Status

Após completar todos os passos:
- ✅ API rodando em Railway
- ✅ PostgreSQL conectado
- ✅ Redis cache funcional
- ✅ Migrations executadas
- ✅ Health check OK

Pronto para usar! 🚀

---

## Próximos Passos

Agora que a API está em Railway:

1. **Implementar módulos** — Ver CLAUDE.md
2. **Configurar CI/CD** — Auto-deploy no push
3. **Monitorar** — Check logs regularmente
4. **Escalar** — Aumentar memory/CPU se necessário

Ver **DEPLOY.md** para detalhes avançados.
