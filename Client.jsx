import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RegisterProvider from '../providers/admin/RegisterProvider';
import { ThemeProvider } from '../providers/admin/ThemeProvider';
import {
  FormDataProvider,
  useFormData,
} from '../providers/client/FormDataProvider';
import ItemsProvider, { useItems } from '../providers/client/ItemsProvider';
import OrdersProvider, { useOrders } from '../providers/client/OrdersProvider';
import StoreProvider from '../providers/client/StoreProvider';
import routes from '../routes';

const ClientResetToken = () => {
  const { resetForm, data } = useFormData();

  const { dispatch } = useItems();

  const { setOrders } = useOrders();

  const identification = (data.client && data.client.identification) || '';

  React.useEffect(() => {
    resetForm();
    dispatch({ type: 'reset' });
    setOrders([]);
  }, [identification, dispatch, setOrders, resetForm]);

  return null;
};

function ClientLayout() {
  const clientRoutes = React.useMemo(
    () =>
      routes.map((route) => {
        if (route.layout === '/client') {
          return (
            <Route
              path={route.layout + route.path}
              key={route.layout + route.path}
              component={route.component}
              exact={route.exact}
            />
          );
        }

        return null;
      }),
    []
  );

  return (
    <FormDataProvider>
      <StoreProvider>
        <OrdersProvider>
          <ItemsProvider>
            <ClientResetToken />

            <ThemeProvider>
              <RegisterProvider>
                <Switch>{clientRoutes}</Switch>
              </RegisterProvider>
            </ThemeProvider>
          </ItemsProvider>
        </OrdersProvider>
      </StoreProvider>
    </FormDataProvider>
  );
}

export default ClientLayout;
