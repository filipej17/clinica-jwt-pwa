# Clínica — Cadastro e Autenticação de Médicos e Pacientes (JWT + PWA)

Node.js + Express + MongoDB (Mongoose) + JWT + bcryptjs + Swagger + PWA.

## Perfis

| Perfil | Cadastro | Campos específicos | Acessa |
|---|---|---|---|
| `paciente` | público | CPF, data de nascimento, telefone | lista de médicos |
| `medico` | público | CRM, especialidade | lista de pacientes e de médicos |
| `admin` | **não** é possível pelo cadastro público | — | tudo (criar direto no banco) |

## Endpoints

```text
POST /api/auth/register   cadastra paciente ou médico
POST /api/auth/login      retorna { token, usuario }
GET  /api/auth/me         dados do usuário logado        (JWT)
GET  /api/medicos         lista médicos                  (JWT)
GET  /api/pacientes       lista pacientes                (JWT, médico/admin)
```

Documentação: `/api-docs`.

## Rodar localmente

```bash
cp .env.example .env     # ajuste MONGO_URI e JWT_SECRET
npm install
npm run dev
```

Abra http://localhost:3000 (Swagger em http://localhost:3000/api-docs).

## Deploy (Render + MongoDB Atlas)

O Express serve o frontend, então basta **um** serviço.

1. Atlas: crie um cluster gratuito, um usuário de banco e libere o acesso de rede (`0.0.0.0/0`). Copie a connection string.
2. GitHub: suba o código (veja abaixo).
3. Render: **New > Web Service**, conecte o repositório.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `MONGO_URI` (string do Atlas), `JWT_SECRET` (valor longo e aleatório)
4. Acesse a URL `https://<seu-servico>.onrender.com`.

## Subir no GitHub

```bash
git init
git add .
git commit -m "Cadastro e autenticação de médicos e pacientes"
git branch -M main
git remote add origin https://github.com/<usuario>/<repositorio>.git
git push -u origin main
```

O `.env` está no `.gitignore` e não deve ser enviado.
