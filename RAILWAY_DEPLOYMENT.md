# Deployar Med-System no Railway (API + Frontend)

## Status Atual
- ✅ **API**: Deployada no Railway (https://med-systemapi-production.up.railway.app)
- ⏳ **Frontend**: Pronto para deploy

## Passo 1: Adicionar Serviço de Frontend no Railway Dashboard

### 1.1 Acesse o Railway Dashboard
- Vá para: https://railway.app/dashboard
- Selecione o projeto **med-system**

### 1.2 Adicione um novo serviço
1. Clique em **"+ New"** (ou **"Create"**)
2. Escolha **"GitHub Repo"**
3. Selecione o repositório **MED-SYSTEM**
4. Clique em **"Create Service"**

### 1.3 Configure o serviço de Frontend
Na nova janela, clique em **Settings**:

1. **Dockerfile Path**: `/Dockerfile.web`
2. **Port**: `3001`
3. **Start Command**: `npm -w @med-system/web run start`

### 1.4 Adicione variáveis de ambiente
No painel **Variables**:
```
NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app
NODE_ENV=production
```

### 1.5 Deploy
Clique em **Deploy** ou faça push para main:
```bash
git push origin main
```

---

## Passo 2: Rodar Localmente com Docker Compose

```bash
# Crie arquivo .env na raiz
cp .env.example .env.local

# Edite com suas configurações (opcional, tem defaults)
# DATABASE_URL=postgresql://medsystem:medsystem123@postgres:5432/medsystem

# Rode com docker-compose
docker-compose up -d

# API: http://localhost:3000
# Frontend: http://localhost:3001
```

---

## Passo 3: Teste a Integração

### Health Check
```bash
curl https://med-systemapi-production.up.railway.app/health
```

### Login (local ou production)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"doctor@clinic.com",
    "password":"test123",
    "name":"Dr. Silva",
    "clinicId":"clinic-1"
  }'
```

---

## Opção Alternativa: Usar Vercel para o Frontend

Se preferir desacoplar API e Frontend:

### Deploy Frontend em Vercel
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel

# Configure variável de ambiente
# NEXT_PUBLIC_API_URL: https://med-systemapi-production.up.railway.app
```

---

## Troubleshooting

### Frontend não conecta na API
- Verifique `NEXT_PUBLIC_API_URL` no .env
- Checa se a API está respondendo em /health
- Verifica se CORS está configurado

### Build falha no Railway
- Verifica se Dockerfile.web existe
- Verifica se npm install completa
- Checa logs: Railway Dashboard → Service → Logs

### Porta em uso localmente
```bash
# Kill processo na porta 3000 (API)
lsof -ti:3000 | xargs kill -9

# Kill processo na porta 3001 (Frontend)
lsof -ti:3001 | xargs kill -9
```

---

## Resumo: Ambos Rodando

### Local (Docker Compose)
```bash
docker-compose up -d
# API: http://localhost:3000
# Frontend: http://localhost:3001
```

### Production (Railway)
```
API: https://med-systemapi-production.up.railway.app
Frontend: https://med-system-web-production.up.railway.app (depois de deployar)
```

---

## Próximos Passos

1. ✅ Commit + Push
2. ⏳ Railway rebuild (2-3 min)
3. ✅ Teste endpoints
4. ✅ Acesse frontend

```bash
# Faça commit
git add -A
git commit -m "feat: add Next.js frontend deployment config"

# Push (auto-triggers Railway build)
git push origin main
```
