# Mini Controle de Fábrica de Software – Frontend

Frontend desenvolvido em **React (Vite)** para consumir a API REST do backend (Laravel) e disponibilizar as telas:

- Clientes (CRUD)
- Projetos (CRUD)
- Lançamentos (CRUD + filtros)
- Dashboard (métricas + resumo por tipo + gráfico)

---

## Links (Produção)

- **Frontend (GitHub Pages):** https://dev-froes.github.io/fabrica-software-frontend/
- **Backend (Railway):** https://fabrica-software-backend-production.up.railway.app/api/clientes

> Observação: o frontend consome o backend via variável de ambiente `VITE_API_URL`.

---

## Tecnologias

- React + Vite
- React Router (HashRouter, compatível com GitHub Pages)
- Axios
- Chart.js + react-chartjs-2
- CSS por página (organização por responsabilidade)

---

## Estrutura do Projeto

- `src/pages/` → telas (Clientes, Projetos, Lançamentos, Dashboard)
- `src/services/` → camada de comunicação com a API (Axios)
- `src/components/` → componentes reutilizáveis (Sidebar, Layout, etc.)
- `src/index.css` → estilos globais

---

## Como rodar localmente

### 1️ Clonar o repositório

```bash
git clone https://github.com/dev-froes/fabrica-software-frontend.git
cd fabrica-software-frontend
---
### 2 Instalar dependências

```bash
npm install
---
### 3 Configurar variável de ambiente
Crie um arquivo .env na raiz do projeto
VITE_API_URL=https://fabrica-software-backend-production.up.railway.app/api

### 4 Subir o projeto
```bash
npm run dev

Acesse:http://localhost:5173

### Deploy no GitHub Pages

Este projeto utiliza gh-pages para publicar o build do Vite no GitHub Pages.

1️ Configurar vite.config.js

O base deve ser o nome do repositório:

base: "/fabrica-software-frontend/"

2️ Deploy
npm run deploy

 Rotas (Navegação)

Por ser hospedado em ambiente estático (GitHub Pages), o projeto utiliza HashRouter para evitar erro 404 no refresh.

Exemplos:

./#/clientes

./#/projetos

./#/lancamentos

./#/dashboard

### Funcionalidades por tela
##Clientes

.Listar

.Buscar por nome/e-mail

.Criar

.Editar

.Excluir

##Projetos

.Listar

.Criar (com select de cliente)

.Excluir

.(Opcional: editar, se implementado)

##Lançamentos

.Listar

.Filtrar por projeto e período

.Criar (com select de projeto)

.Excluir

##Dashboard

.Selecionar projeto + período

.Cards de métricas

.Resumo por tipo

.Gráfico de horas por tipo

## Autor

Projeto desenvolvido por Daniel Fróes Cavalcante para desafio técnico.