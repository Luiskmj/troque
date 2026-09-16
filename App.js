/* eslint-disable */
import './assets/scss/argon-dashboard-react.scss';
import './assets/vendor/@fontawesome/index.js';
import './assets/vendor/nucleo/css/nucleo.css';
import PrivateRoute from './config/privateRoute';
import AdminLayout from './layouts/Admin.jsx';
import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './assets/tailwind/tailwind.css';
import AuthLayout from './layouts/Auth';
import ClientLayout from './layouts/Client';
import NotFound from './views/admin/NotFound';
import CreateStore from './views/admin/Register/CreateStore';

export default function App() {
  moment.locale('pt-br');

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={['/', '/forgot-password', '/reset-password/:token/:email']}
          component={(props) => <AuthLayout {...props} />}
        />

        <Route
          exact
          path={'/create-store'}
          component={(props) => <CreateStore  {...props}/>}
        />

        <PrivateRoute
          path="/admin"
          component={(props) => <AdminLayout {...props} />}
        />

        <Route
          path="/client"
          component={(props) => <ClientLayout {...props} />}
        />

        <Route exact path="*" render={(props) => <NotFound {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}
