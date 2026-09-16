import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/img/icon-login.svg';
import ImageNotebook from '../assets/img/banner-login.png';
import Forgot from '../views/authentication/Forgot';
import Login from '../views/authentication/Login';
import Reset from '../views/authentication/Reset';

function AuthLayout() {
  const [imageDescription, setImageDescription] = React.useState(
    'Faça seu login na plataforma'
  );

  return (
    <div className="_w-full _min-h-screen _max-w-5xl _mx-auto _p-16 _flex _items-center _justify-center">
      <div className="_flex-1">
        <Switch>
          <Route path="/reset-password/:token/:email">
            <Reset setImageDescription={setImageDescription} />
          </Route>

          <Route path="/forgot-password">
            <Forgot />
          </Route>

          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>

      <div className="_flex-1 _ml-64 _overflow-hidden  _hidden lg:_block">
        <div className="_pb-full _relative">
          <a target='_blank' href="https://troquerapido.plataformaeva.com/create-store">
            <div className="_absolute _inset-0 _flex _justify-center _items-center">

              <div
                className="_absolute _inset-0 _bg-center _bg-no-repeat _bg-cover"
                style={{
                  backgroundImage: `url(${ImageNotebook})`,
                }}
              />

              <div className="_absolute _h-1/2 _fill-current _text-white _opacity-25">
                <Logo className="_h-full" />
              </div>

            </div>
          </a>

        </div>
      </div>

    </div >
  );
}

export default AuthLayout;
