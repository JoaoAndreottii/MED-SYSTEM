# Deployar Med-System com API + Frontend no Railway

## 📋 Pré-requisitos

- Projeto Railway criado: **med-system**
- GitHub repo: **MED-SYSTEM** conectado
- PostgreSQL e Redis já provisionados no Railway

## 🚀 Passo 1: Configurar Serviço API

### 1.1 Acesse Railway Dashboard
- https://railway.app/dashboard
- Selecione projeto **med-system**

### 1.2 Clique em "+ New Service"
1. Escolha **GitHub Repo**
2. Selecione **MED-SYSTEM**
3. Clique **Create Service**

### 1.3 Configure para API
Clique em **Settings**:
- **Dockerfile Path**: `/Dockerfile`
- **Port**: `3000`
- **Start Command**: (deixe vazio, Dockerfile já define)

### 1.4 Variáveis de Ambiente (Variables)
```
DATABASE_URL=<seu PostgreSQL>
REDIS_URL=<seu Redis>
JWT_SECRET=sua-chave-secreta-aqui
NODE_ENV=production
```

### 1.5 Deploy
Clique **Deploy** ✅

---

## 🎨 Passo 2: Configurar Serviço Web (Frontend)

### 2.1 Clique em "+ New Service" novamente
1. Escolha **GitHub Repo**
2. Selecione **MED-SYSTEM**
3. Clique **Create Service**

### 2.2 Configure para Web
Clique em **Settings**:
- **Dockerfile Path**: `/Dockerfile.web`
- **Port**: `3001`
- **Start Command**: (deixe vazio, Dockerfile já define)

### 2.3 Variáveis de Ambiente (Variables)
```
NEXT_PUBLIC_API_URL=https://med-systemapi-production.up.railway.app
NODE_ENV=production
```

### 2.4 Deploy
Clique **Deploy** ✅

---

## ✅ Resultado Final

Após 3-5 minutos de build:

| Serviço | URL | Porta |
|---------|-----|-------|
| **API** | `https://med-systemapi-production.up.railway.app` | 3000 |
| **Web** | `https://med-system-web-*.up.railway.app` | 3001 |

---

## 🧪 Testar

### Health Check (API)
```bash
curl https://med-systemapi-production.up.railway.app/health
```

### Resultado esperado:
```json
{"status":"ok","timestamp":"2026-06-25T...","uptime":...}
```

### Login no Frontend
1. Acesse: `https://med-system-web-*.up.railway.app` 
2. Clique em **Login**
3. Teste com credenciais (crie via API primeiro)

---

## 🔧 Se Tiver Problemas

### API não responde (502)
- Verifica **Logs** do serviço API no Railway
- Verifica se PostgreSQL está rodando
- Verifica variáveis de ambiente (DATABASE_URL, REDIS_URL)

### Web não carrega
- Verifica se API está respondendo em /health
- Verifica NEXT_PUBLIC_API_URL nas variáveis
- Verifica **Logs** do serviço Web

### Build falha
- Verifica Dockerfile path correto
- Verifica se GitHub está sincronizado
- Tenta fazer push novamente: `git push origin main`

---

## 📡 API Endpoints Disponíveis

Todos requerem JWT token de `/auth/login`:

- `POST /auth/login` - Login
- `POST /auth/register` - Registrar
- `GET /appointments` - Listar agendamentos
- `POST /appointments` - Criar agendamento
- `GET /patients` - Listar pacientes
- `POST /patients` - Criar paciente
- ... (40+ endpoints)

---

## 💡 Dica

Se quiser testar localmente primeiro:
```bash
docker-compose -f docker-compose.prod.yml up -d
# API: http://localhost:3000
# Web: http://localhost:3001
```

---

## 🎉 Pronto!

Agora você tem Med-System completo com:
- ✅ API REST completa
- ✅ Frontend Next.js
- ✅ PostgreSQL + Redis
- ✅ Multi-tenant
- ✅ Autenticação JWT
- ✅ 8 módulos funcionais

Tudo rodando em Railway! 🚀
