# E-commerce Mobile App com Assistente IA

Aplicativo de e-commerce completo desenvolvido com React Native/Expo (frontend) e Node.js/Express (backend), integrando um assistente de IA em tempo real via WebSocket para auxiliar nas compras.

## 👨‍💻 Tecnologias Utilizadas

### Frontend (Cliente)
- React Native / Expo
- TypeScript
- Expo Router (navegação)
- Context API (gerenciamento de estado)
- WebSocket (chat em tempo real)
- Axios (requisições HTTP)

### Backend (Servidor)
- Node.js com Express
- Sequelize ORM
- JWT (autenticação)
- WebSockets
- Google Gemini API (integração com IA)

## 🚀 Recursos Implementados

1. **Sistema de Autenticação**
   - Login/Registro de usuários
   - Gerenciamento de perfil
   - Token JWT

2. **Catálogo de Produtos**
   - Listagem com imagens e descrições
   - Estoque em tempo real

3. **Carrinho de Compras**
   - Gerenciamento completo (adicionar/remover/ajustar)
   - Persistência de dados

4. **Finalização de Compras**
   - Múltiplos métodos de pagamento
   - Histórico de pedidos

5. **Assistente Virtual com IA**
   - Chat em tempo real com IA
   - Busca inteligente de produtos
   - Recomendações personalizadas
   - Comandos por voz (futura implementação)

## 🛠️ Instalação e Configuração

### Requisitos
- Node.js v14+
- npm ou yarn
- Expo CLI
- Chave API do Google Gemini (para funcionalidades de IA)

### Passo a Passo

#### Backend (Servidor)
1. Configure o arquivo `.env` na pasta server:
```
# Servidor
PORT=3000

# Banco de Dados
DB_NAME=ecommerce
DB_USER=root
DB_PASS=sua_senha
DB_HOST=localhost
DB_DIALECT=mysql

# Autenticação
JWT_SECRET=seu_segredo_jwt

# IA
GEMINI_API_KEY=sua_chave_api_gemini
AI_TEMPERATURE=0.7
AI_LOG_LEVEL=info
```

2. Instale as dependências e inicie o servidor:
```bash
cd server
npm install
npm run dev
```

#### Frontend (Cliente)
1. Configure o arquivo `config/api.ts` com o endereço do seu servidor:
```typescript
// Exemplo para uso em dispositivo físico (substitua pelo IP do seu computador)
export const SERVER_URL = 'http://ip:3000';
export const WEBSOCKET_URL = 'ws://ip:3000';
```

2. Instale as dependências e inicie o aplicativo:
```bash
cd client
npm install
npx expo start
```

## 📱 Como Usar

1. **Autenticação**
   - Registre-se com CPF, e-mail e senha
   - Faça login com suas credenciais

2. **Explorar Produtos**
   - Navegue pelo catálogo na página inicial
   - Adicione produtos ao carrinho com um toque

3. **Assistente IA**
   - Pergunte sobre produtos específicos (ex: "Vocês têm arroz?")
   - Pergunte sobre preços (ex: "Quanto custa o feijão?")
   - Adicione ao carrinho via chat (ex: "Adicione arroz ao carrinho")
   - Consulte seu histórico (ex: "Mostre meus pedidos anteriores")

4. **Finalização de Compra**
   - Revise os itens no carrinho
   - Escolha o método de pagamento
   - Confirme o pedido
   - Acompanhe no histórico

## 🧪 Exemplos de Comandos para o Assistente IA

- "Quais produtos vocês têm disponíveis?"
- "Vocês têm arroz? Qual o preço?"
- "Mostre meu carrinho"
- "Adicione leite ao carrinho"
- "Remova feijão do carrinho"
- "Limpe meu carrinho"
- "Mostre meus pedidos finalizados"
- "Qual foi minha última compra?"

## 🔧 Solução de Problemas

- **Erro de conexão WebSocket**: Verifique se o servidor está rodando e se o IP configurado está correto
- **Falha na IA**: Verifique se sua chave API Gemini está configurada corretamente no .env
- **Falha ao finalizar compra**: Verifique se está autenticado e se há produtos no carrinho

## 📝 Nota para Desenvolvedores

- O aplicativo usa uma conexão WebSocket para comunicação em tempo real com o assistente IA
- Para desenvolvimento local, certifique-se de que o dispositivo móvel e o servidor estão na mesma rede
- Para ambientes de produção, configure corretamente as URLs no arquivo `config/api.ts`

## 📋 Estrutura Simplificada do Projeto

```
ecommerce-mobile/
├── client/             # Aplicativo React Native/Expo
│   ├── app/            # Rotas e telas
│   ├── components/     # Componentes reutilizáveis
│   ├── config/         # Configurações
│   └── services/       # Serviços e APIs
│
└── server/             # Servidor Node.js/Express
    └── src/
        ├── config/     # Configurações
        ├── controllers/# Lógica de negócios
        ├── models/     # Modelos do banco de dados
        ├── routers/    # Rotas da API
        └── services/   # Serviços de IA e outros
```

## 📞 Contato

- **Desenvolvedor**: João Matheus
- **E-mail**: jomatheusdev@gmail.com
- **GitHub**: [jomatheusdev](https://github.com/jomatheusdev)
