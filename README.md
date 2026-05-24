# Ford Radar Mobile

Aplicativo mobile corporativo desenvolvido em React Native com Expo para uso interno da Ford, focado em inteligência competitiva automotiva e visualização de dados preditivos de retenção de clientes.

O aplicativo consome os serviços REST da API Ford Radar, permitindo autenticação segura com JWT, comparação inteligente de veículos concorrentes e consulta de dados estratégicos utilizados pela equipe comercial e pós-venda.

---

# Objetivo do projeto

O Ford Radar Mobile foi criado para otimizar o processo de análise competitiva dentro da Ford.

Durante negociações comerciais, consultores frequentemente precisam buscar especificações técnicas de veículos concorrentes em múltiplas fontes externas. O aplicativo centraliza esse fluxo em uma experiência mobile integrada com API e IA.

Além disso, o sistema permite visualizar informações preditivas de retenção de clientes, auxiliando estratégias de pós-venda e fidelização.

---

# Tecnologias utilizadas

## Mobile

* React Native
* Expo
* TypeScript

## Arquitetura

* Componentização
* Context API
* Estrutura modular por domínio
* Serviços centralizados de API

## Comunicação

* Axios
* REST API
* JWT Authentication

## Segurança

* Expo Secure Store
* Persistência segura de token
* Rotas autenticadas
* HTTPS Ready

---

# Estrutura do projeto

```text
src/
├── components/
│   └── UI.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CompareScreen.tsx
│   ├── CompareResultScreen.tsx
│   ├── PredictionsScreen.tsx
│   └── PredictionDetailScreen.tsx
│
├── services/
│   └── api.ts
│
├── theme/
│   └── index.ts
│
└── App.tsx
```

---

# Funcionalidades principais

## Autenticação segura

O aplicativo possui fluxo completo de autenticação utilizando JWT.

Fluxo implementado:

* login
* cadastro de usuários
* persistência de autenticação
* armazenamento seguro do token
* proteção de rotas autenticadas

O token JWT é armazenado utilizando:

```ts
Expo Secure Store
```

---

# Comparação inteligente de veículos

O usuário pode informar:

* marca
* modelo
* versão
* atributos desejados

Exemplo:

```json
{
  "brand": "Toyota",
  "model": "Hilux",
  "version": "GR-Sport",
  "targetAttributes": [
    "engine",
    "power",
    "torque"
  ]
}
```

O aplicativo envia os dados para:

```http
POST /api/v1/vehicles/compare
```

A API realiza:

* validação
* busca em cache
* consulta ao banco
* integração com IA Gemini

O resultado retorna em formato padronizado e é exibido no app de forma organizada.

---

# Predição de retenção de clientes

O aplicativo também permite consultar e cadastrar informações relacionadas à retenção de clientes.

Funcionalidades:

* cadastro de predição
* consulta por VIN
* listagem paginada
* visualização detalhada

Endpoints utilizados:

```http
POST /api/v1/predictions
GET /api/v1/predictions/{vin}
GET /api/v1/predictions
```

---

# Camada de serviços

Toda comunicação HTTP foi centralizada no arquivo:

```text
src/services/api.ts
```

Responsabilidades:

* configuração global do Axios
* autenticação JWT
* interceptação de requisições
* tipagem TypeScript
* comunicação REST com o backend

Exemplo:

```ts
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
```

---

# Gerenciamento de autenticação

A autenticação da aplicação é gerenciada através de:

```text
src/context/AuthContext.tsx
```

Responsabilidades:

* salvar token
* recuperar sessão
* logout
* compartilhar autenticação globalmente

---

# Interface e experiência do usuário

A interface foi construída buscando uma experiência corporativa moderna, com:

* visual dark mode
* identidade visual tecnológica
* componentes reutilizáveis
* feedback visual de carregamento
* tratamento amigável de erros
* navegação simplificada

---

# Segurança implementada

O aplicativo segue os requisitos da sprint de Cybersecurity.

Implementações realizadas:

* autenticação JWT
* armazenamento seguro de token
* proteção de sessões
* tratamento de erros da API
* validação de entrada
* não armazenamento de senhas
* comunicação preparada para HTTPS

---

# Fluxo principal da aplicação

## Cenário 1 — Comparação de concorrente

1. O consultor realiza login
2. Informa marca, modelo e versão
3. O app envia os dados para a API
4. A API processa a solicitação
5. O app exibe a comparação técnica

---

# Como executar o projeto

## Instalar dependências

```bash
npm install
```

## Executar aplicação

```bash
npx expo start
```

---

# Configuração da API

A URL da API pode ser alterada no arquivo:

```text
src/services/api.ts
```

Exemplo:

```ts
const BASE_URL = 'http://10.0.2.2:8081';
```

---

# Integração com o backend

O aplicativo depende diretamente da API Ford Radar para:

* autenticação
* comparação automotiva
* consulta de retenção
* persistência de dados
* integração com IA

Toda lógica de negócio permanece centralizada no backend Spring Boot.

---

# Resumo final

O Ford Radar Mobile entrega uma solução mobile corporativa para a Ford, integrando:

* autenticação segura
* análise competitiva automotiva
* integração com IA
* visualização de dados preditivos
* arquitetura modular escalável
* comunicação RESTful segura

O projeto foi desenvolvido utilizando React Native com Expo e preparado para futuras evoluções da plataforma.
