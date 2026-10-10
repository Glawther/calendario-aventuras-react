# Calendário de Aventuras

Aplicação web para planejar passeios e viagens a dois: você cadastra uma ideia, diz onde é,
marca em que pé ela está e acompanha tudo em uma lista filtrável. Os dados ficam no Firebase,
então a lista é a mesma em qualquer aparelho em que você entrar com a sua conta.

## Funcionalidades

- Login e cadastro por e-mail e senha (Firebase Authentication).
- Cadastro de planos com título, local, data e status.
- Quatro status: Planejado, Agendado, Sonho e Concluído.
- Filtro da lista por status.
- Alterar o status e excluir um plano direto na lista.
- Layout responsivo, pensado para uso no celular.

## Tecnologias

- React 19 e Vite
- Firebase Authentication e Cloud Firestore
- Firebase Hosting, com publicação automática por GitHub Actions
- ESLint

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Firebase](https://console.firebase.google.com/), ative a autenticação por e-mail e senha e o Firestore.

3. Crie um arquivo `.env` na raiz com os dados do seu projeto Firebase:

   ```
   VITE_API_KEY=
   VITE_AUTH_DOMAIN=
   VITE_PROJECT_ID=
   VITE_STORAGE_BUCKET=
   VITE_MESSAGING_SENDER_ID=
   VITE_APP_ID=
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

O arquivo `.env` não deve ser enviado ao repositório.

## Estrutura

| Caminho | Papel |
| --- | --- |
| `src/App.jsx` | Decide entre a tela de login e a aplicação, e controla o filtro ativo |
| `src/components/Login.jsx` | Login e cadastro |
| `src/components/AdventureForm.jsx` | Formulário de novo plano |
| `src/components/AventurasList.jsx` | Lista, troca de status e exclusão |
| `src/components/FilterBar.jsx` | Filtro por status |
| `src/firebase/` | Configuração do Firebase e contexto de autenticação |
| `firestore.rules` | Regras de acesso ao banco |

## Publicação

Os fluxos em `.github/workflows/` publicam no Firebase Hosting a cada merge na branch principal
e geram uma prévia para cada pull request.
