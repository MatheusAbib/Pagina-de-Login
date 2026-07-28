# 🔐 Meu Painel - Login + Cadastro + CRUD

Sistema completo de autenticação e gerenciamento de usuários com **frontend em Angular** e **backend em Node.js**, permitindo **login**, **cadastro**, **recuperação de senha**, **CRUD de endereços e cartões**, **foto de perfil** e **logo dinâmica via banco de dados**.

---

## 🛠 Tecnologias utilizadas

### Frontend

- **Angular 21**: Standalone Components, Reactive Forms, Lazy Loading
- **TypeScript**: Tipagem estática e segurança
- **SCSS**: Estilização modular com variáveis globais
- **NGX-Toastr**: Notificações toast personalizadas
- **Bootstrap Icons**: Biblioteca de ícones
- **Ngx-Mask**: Máscaras para CPF, telefone, cartão e CEP
- **Angular Router**: Navegação com AuthGuard

### Backend

- **Node.js + Express**: API REST
- **JWT (JSON Web Token)**: Autenticação e autorização
- **Sequelize**: ORM para MySQL
- **MySQL**: Banco de dados relacional
- **Bcrypt.js**: Criptografia de senhas

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com validação de email e senha
- Cadastro completo com validação em tempo real
- Máscaras para CPF, Telefone e CEP
- Recuperação de senha via modal (com link de reset)
- Logout com modal de confirmação
- AuthGuard protegendo rotas privadas

### 👤 Perfil do Usuário
- Visualização e edição de dados pessoais
- Alteração de senha com modal e validação
- Foto de perfil com upload, preview, zoom e posicionamento

### 📦 Dashboard
- Header com saudação personalizada e foto de perfil
- Avatar com lápis para editar foto
- Estatísticas (nome, endereços, cartões)
- Navegação rápida para todas as seções
- Cards de acesso com ícones
- Footer estilizado
- Logo do sistema vinda do banco de dados
- Favicon dinâmico vindo do banco de dados

### 📍 Endereços
- CRUD completo (criar, editar, excluir)
- Busca automática por CEP (ViaCEP)
- Modal de edição com blur no fundo
- Confirmação para excluir
- Máscara no CEP

### 💳 Cartões
- CRUD completo (criar, editar, excluir)
- Máscara no número do cartão (0000 0000 0000 0000)
- Máscara na validade (MM/AAAA)
- Pipe para formatar número com espaços
- Modal de edição com blur
- Confirmação para excluir

### 🎨 Design System
- Cores com gradientes (roxo e verde)
- Ícones Bootstrap em todo o sistema
- Bordas arredondadas e design limpo
- Modais com backdrop blur
- Layout responsivo (mobile, tablet, desktop)
- Footer em todas as páginas
- Notificações toast (ngx-toastr)

---

## 🗂️ Banco de Dados

### Tabelas principais:

#### `cliente`

| Campo            | Tipo         | Descrição                          |
|------------------|--------------|------------------------------------|
| id               | BIGINT       | Chave primária, auto incremento    |
| nome             | VARCHAR(255) | Nome completo do usuário           |
| email            | VARCHAR(255) | Email do usuário (único)           |
| genero           | VARCHAR(50)  | Gênero do usuário                  |
| data_nascimento  | VARCHAR(20)  | Data de nascimento                 |
| cpf              | VARCHAR(20)  | CPF do usuário (único)             |
| telefone         | VARCHAR(20)  | Telefone para contato              |
| senha            | VARCHAR(255) | Senha criptografada com bcrypt     |
| foto             | LONGTEXT     | Foto de perfil em base64           |
| data_cadastro    | DATETIME     | Data de criação do registro        |
| data_alteracao   | DATETIME     | Data da última atualização         |

---

#### `endereco`

| Campo              | Tipo         | Descrição                          |
|--------------------|--------------|------------------------------------|
| id                 | BIGINT       | Chave primária, auto incremento    |
| endereco_entrega   | VARCHAR(255) | Logradouro / Rua                   |
| numero             | VARCHAR(255) | Número do endereço                 |
| bairro             | VARCHAR(255) | Bairro                             |
| cep                | VARCHAR(255) | CEP do endereço                    |
| cidade             | VARCHAR(255) | Cidade                             |
| estado             | VARCHAR(255) | Estado (UF)                        |
| pais               | VARCHAR(255) | País                               |
| tipo_residencia    | VARCHAR(255) | Tipo de residência (Casa, Apt...)  |
| descricao_endereco | VARCHAR(255) | Ponto de referência / descrição    |
| cliente_id         | BIGINT       | Chave estrangeira → `cliente(id)`  |

---

#### `cartao`

| Campo              | Tipo         | Descrição                          |
|--------------------|--------------|------------------------------------|
| id                 | BIGINT       | Chave primária, auto incremento    |
| numero_cartao      | VARCHAR(255) | Número do cartão (com máscara)     |
| bandeira           | VARCHAR(255) | Bandeira do cartão (Visa, MC...)   |
| codigo_seguranca   | VARCHAR(255) | CVV / Código de segurança          |
| nome_cartao        | VARCHAR(255) | Nome impresso no cartão            |
| validade           | VARCHAR(255) | Validade (MM/AAAA)                 |
| cliente_id         | BIGINT       | Chave estrangeira → `cliente(id)`  |

---

#### `config`

| Campo    | Tipo         | Descrição                          |
|----------|--------------|------------------------------------|
| id       | BIGINT       | Chave primária, auto incremento    |
| chave    | VARCHAR(100) | Nome da configuração (único)       |
| valor    | LONGTEXT     | Valor da configuração              |
| descricao| VARCHAR(255) | Descrição da configuração          |


