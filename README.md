# Apresentação

O painel do Troque Rápido é dividido em duas partes principais: a parte administrativa (lojista) e a parte cliente, onde os pedidos de troca são feitos.

## Painel Cliente

Para que um pedido de troca seja feito, o cliente deve utilizar a URL do Troque Rápido da loja em que realizou a compra. Cada loja tem sua própria URL do Troque Rápido.

Vamos usar de exemplo a loja da [Eva](https://troquerapido.plataformaeva.com/client/logistica/?store_id=106abdbe631).

1. O primeiro passo após o cliente acessar a URL da loja em que comprou seu produto, é inserir seu CPF para que seus pedidos sejam buscados na Nuvemshop.

2. O cliente poderá então selecionar um de seus pedidos e então selecionar os produtos que deseja trocar.

3. Após os produtos estarem selecionados, basta clicar no botão "Terminar solicitação" e continuar para a próxima etapa.

4. Para a realização do pedido de troca, o cliente deverá inserir os seguintes dados:

- Endereço do cliente
- Motivo da solicitação
- Informações pessoais e de contato

## Para rodar o projeto é necessário o nodejs 13.14.0

## Painel Administrativo

O painel administrativo pode ser acessado através deste [link](https://troquerapido.plataformaeva.com/).
Esta seção do painel é dividida nas seguintes páginas:

### Solicitações

Esta é a página em que o lojista poderá aprovar/rejeitar/cancelar as solicitações de troca.

### Relatórios

Aqui ficam todos os relatórios a respeito das solicitações de troca do lojista.

### Planos

O lojista poderá contratar ou configurar seu plano nesta página.

### Configurações

Esta página permite que o lojista configure e personalize todo o painel.

### Suporte

Aqui fica o formulário para que o lojista peça suporte para a equipe do Troque Rápido, caso necessário.

# Iniciando com o projeto

- **Primeiro**, instale todas as dependências:

```bash
npm install
# or
yarn
```

- **Segundo**, inicie o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Estrutura

## Criação de páginas/rotas - src/routes.js

Essa sessão é referente a todas as páginas que o usuário pode acessar no site. Tanto páginas que não necessitam de autenticação, ou páginas que necessitam de autenticação, além de configurar serão ou não visíveis no menu lateral.

O arquivo de rotas está localizado em "src/routes.js".

- Para adicionar uma nova rota

```ts
// Adicione um objeto, no mesmo esquema abaixo, no array "routes"
  {
    admin: false, // diz se é uma rota que apenas administradores do Troque Rápido poderão acessar (contas da própria EVA, por exemplo)
    path: '/home', // subpath desta rota
    invisible: true, // diz se deve aparecer no menu lateral ou não
    name: 'Início', // nome da rota no menu lateral
    icon: 'fas fa-home', // ícone da rota no menu lateral (FontAwesome)
    component: Home, // o componente (página) que será renderizado quando o usuário acessar esta rota
    layout: '/admin', // o layout base da página. /admin ou /client ou /auth
  },
```

## Assets - src/assets

Insira aqui todos os assets utilizados pelo painel.

## Utilitários - src/common | src/utils

Insira aqui todo código utilitário que você precisar.

## Componentes - src/components

Insira aqui todos os components utilizados pelo painel.

## Configuração - src/config

Aqui vão alguns arquivos de configuração do painel.

O arquivo "api.js" contém a instância base do axios para chamadas na API do Troque Rápido.
Você deve utilizá-la da seguinte forma:

```ts
import api from 'src/api.js';

api.get('/alguma-rota').then((data) => console.log(data));
```

Quando estiver testando alguma funcionalidade nova, você pode alterar a baseURL da instância do axios para a URL de teste do Troque Rápido:

```ts
// URL de teste: https://www.troquerapido-api-teste.plataformaeva.com/
// URL de produção: https://www.troquerapido-api.plataformaeva.com/
const api = axios.create({
  baseURL: 'https://www.troquerapido-api.plataformaeva.com/',
});
```

## Containers - src/containers

Aqui vão alguns componentes mais complexos, não tão reutilizáveis. São componentes que englobam outros componentes.

## Hooks React personalizados - src/hooks

Aqui vão alguns hooks personalizados utilizados por todo o projeto.

## Layouts - src/layouts

Aqui irão os layouts do painel.
Os layouts são responsáveis por englobarem as páginas do painel. Por exemplo, o layout "Admin" faz com que toda página que caia dentro desse layout tenha um menu lateral, um header e um footer. Atualmente existem três layouts:

- Admin
- Auth
- Client

O layout que será utilizado para uma rota específica é definido no arquivo de rotas.

## Providers - src/providers

Aqui vão os Providers do painel. São implementações do React Context, que englobam todo o painel.
Sempre que você criar um Provider novo, você deve colocá-lo em volta do aplicativo todo no arquivo "App.js" ou em algum layout específico.

## Páginas - src/views

Aqui vão os componentes que servem como páginas do painel. Cada pasta aqui representa um layout possível e suas respectivas páginas.

## Estilização

O painel usa como base para estilização de seus componentes o Tailwind. As classes do Tailwind são todas prefixadas com um underline para evitar conflito com as classes do Bootstrap.
Então, para utilizá-lo, deverá ser feito da seguinte forma:

```tsx
<Button className="_bg-red-500 _text-blue-500" /> // classes prefixadas com um underline
```
