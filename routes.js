/* eslint-disable */
import ManagePlans from './views/admin/ManagePlans/index';
import Home from './views/admin/Home/index.jsx';
import ListPlans from './views/admin/listPlans/ListPlans.jsx';
import NotFound from './views/admin/NotFound';
import Plans from './views/admin/Plans';
import { Policy } from './views/admin/Policy/index.jsx';
import Register from './views/admin/Register/index.jsx';
import Reports from './views/admin/Reports';
import Shopkeepers from './views/admin/Shopkeepers';
import Support from './views/admin/Support/index.jsx';
import FormularyClient from './views/client/Formulary';
import HomeClient from './views/client/Home';
import Order from './views/client/Order';

const routes = [
  // Manter a home sempre na primeira posição
  {
    path: '/home',
    name: 'Solicitações', // Nome dentro do componente
    icon: 'fas fa-home', // Ícone da sidebar
    component: Home,
    layout: '/admin',
  },
  {
    admin: true,
    path: '/home',
    name: 'Lojistas',
    icon: 'fas fa-user-shield',
    component: Shopkeepers,
    layout: '/admin',
  },
  {
    admin: true,
    path: '/gerenciar-plano/:tipo/:id/:nome/:limite/:preco/:plataforma',
    invisible: true,
    name: null,
    icon: null,
    component: ManagePlans,
    layout: '/admin',
  },
  {
    admin: true,
    path: '/gerenciar-plano/:tipo',
    invisible: true,
    exact: true,
    name: null,
    icon: null,
    component: ManagePlans,
    layout: '/admin',
  },
  {
    admin: true,
    path: '/listar-planos',
    name: 'Gerencie seus planos',
    icon: 'fas fa-user-shield',
    component: ListPlans,
    layout: '/admin',
  },
  {
    layout: '/admin',
    path: '/relatorios',
    name: 'Relatórios', // Nome dentro do componente
    icon: 'fas fa-chart-area', // Ícone da sidebar
    component: Reports,
  },
  {
    path: '/planos',
    component: Plans,
    layout: '/admin',
    name: 'Planos', // Nome dentro do componente
    icon: 'fas fa-file-signature', // Ícone da sidebar
  },
  {
    path: '/politicas-de-privacidade',
    component: Policy,
    layout: '/admin',
    name: 'Políticas de Privacidade', // Nome dentro do componente
  },
  {
    path: '/configuracoes',
    name: 'Configurações', // Nome dentro do componente
    icon: 'fas fa-cog', // Ícone da sidebar
    component: Register,
    layout: '/admin',
  },
  {
    name: 'Manual de uso',
    href: 'https://troquerapido.freshdesk.com/support/home',
    icon: 'fas fa-books', // Ícone da sidebar
    layout: '/admin',
  },
  {
    path: '/logistica',
    component: HomeClient,
    layout: '/client',
    exact: true,
  },
  {
    path: '/logistica/pedido',
    component: Order,
    layout: '/client',
  },
  {
    path: '/logistica/formulario',
    component: FormularyClient,
    layout: '/client',
  },
  // Manter o support e notfound sempre nas últimas posições respectivamente
  {
    path: '/suporte',
    name: 'Suporte', // Nome dentro do componente
    icon: 'fas fa-hands-helping', // Ícone da sidebar
    component: Support,
    // href: 'https://troquerapido.freshdesk.com/support/tickets/new',
    layout: '/admin',
  },
  {
    path: '*',
    invisible: true,
    component: NotFound,
    layout: '/admin',
  },
];
export default routes;
