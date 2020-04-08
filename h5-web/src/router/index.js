import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import HTTP404 from '@/pages/error/http/404';
import { createHashHistory } from 'history';


import AuthLayout from '@/layouts/AuthLayout';
import BasicLayout from '@/layouts/BasicLayout';

const history = createHashHistory();

// RouterWrapper
export default () => {
  return (
    <Router history={history}>
      <Switch>
        {/*this.renderRoutes(routesTree)*/}

        <Route
          path={'/auth/login'}
          exact={''}
          component={AuthLayout}
        />

        <Route
          path={'/'}
          exact={''}
          component={BasicLayout}
        />

        <Route render={HTTP404} />
      </Switch>
    </Router>
  );
};