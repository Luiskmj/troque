/* eslint-disable global-require */
import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import handleError from '../common/handleError';
import AdminFooter from '../components/Footers/AdminFooter';
import Loading from '../components/Loading';
import AdminNavbar from '../components/Navbars/AdminNavbar';
import Sidebar from '../components/Sidebar/Sidebar';
import api from '../config/api';
import RegisterProvider, {
  useRegister,
} from '../providers/admin/RegisterProvider';
import { ThemeProvider, useTheme } from '../providers/admin/ThemeProvider';
import { AlertProvider } from '../providers/AlertProvider';
import routes from '../routes';

function Admin(props) {
  const location = useLocation();

  const history = useHistory();

  const content = React.useRef(null);

  const { handleFetchedTheme, handleFetchedLogo } = useTheme();

  const {
    isRegisterLoading,
    setIsRegisterLoading,
    setAuthCarriers,
    setAddress,
    setReasons,
    setAdmin,
    handleFetchedMessages,
    handleFetchedApproval,
    isAdmin,
    setIsAdmin,
  } = useRegister();

  const brandText = () => {
    const route = routes.find((routeIn) =>
      location.pathname.includes(`${routeIn.layout}${routeIn.path}`)
    );

    return route ? route.name : '404';
  };

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (content.current) {
      content.current.scrollTop = 0;
    }
  });

  React.useLayoutEffect(() => {
    (async () => {
      setIsRegisterLoading(true);

      try {
        const [
          { data: address },
          { data: authCarriers },
          { data: reasons },
          { data: admin },
          { data: logo },
          { data: theme },
          { data: messages },
          { data: config },
          { data: shippingServices },
          { data: shopkeepers },
        ] = await Promise.all([
          api.get('address'),
          api.get('auth_carriers'),
          api.get('reasons'),
          api.get('admin'),
          api.get('logo_admin'),
          api.get('theme_admin'),
          api.get('message_admin'),
          api.get('config'),
          api.get('shipping_services'),
          api.get('admins?search&limit=10&offset=0'),
        ]);

        handleFetchedApproval({
          approval_mode: config.approval_mode,
          default_service: config.default_service,
          shipping_services: shippingServices,
        });
        setAuthCarriers(authCarriers);
        handleFetchedMessages(messages);
        handleFetchedTheme(theme);
        handleFetchedLogo(logo);
        setAddress(address);
        setReasons(reasons);
        setAdmin(admin);
        setIsAdmin(shopkeepers.status !== 'error');
      } catch (err) {
        handleError(
          err,
          history,
          'Oops... Não foi possível carregar suas configurações salvas. Atualize a página para uma nova tentativa'
        );
      }

      setIsRegisterLoading(false);
    })();
  }, [
    history,
    handleFetchedApproval,
    handleFetchedMessages,
    handleFetchedLogo,
    handleFetchedTheme,
    setAddress,
    setAuthCarriers,
    setReasons,
    setAdmin,
    setIsRegisterLoading,
    setIsAdmin,
  ]);

  if (isRegisterLoading) {
    return <Loading shouldDarkenBg={false} />;
  }

  const routesIn = routes
    .filter((route) => route.layout === '/admin')
    .filter((route) => (isAdmin ? route.admin : !route.admin));

  return (
    <>
      <Sidebar
        {...props}
        routes={routesIn}
        logo={{
          innerLink: '/admin/home',
          imgSrc: '',
          imgAlt: '...',
        }}
      />

      <div ref={content} className="main-content">
        <AdminNavbar {...props} brandText={brandText()} />
        <Switch>
          {routesIn.map((route) => (
            <Route
              path={route.layout + route.path}
              key={route.layout + route.path}
              component={route.component}
            />
          ))}
        </Switch>
        <AdminFooter />
      </div>
    </>
  );
}

function withProviders(Component) {
  const WrappedComponent = () => (
    <RegisterProvider>
      <ThemeProvider>
        <AlertProvider>
          <Component />
        </AlertProvider>
      </ThemeProvider>
    </RegisterProvider>
  );

  return WrappedComponent;
}

export default withProviders(Admin);
