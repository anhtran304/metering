import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PublicRouter, PrivateRouter } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  // ProductList as ProductListView,
  // UserList as UserListView,
  // Typography as TypographyView,
  // Icons as IconsView,
  // Account as AccountView,
  // Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  StationList as StationListView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <PrivateRouter
        component={DashboardView}
        exact
        layout={MainLayout}
        isDashboard = 'true'
        path="/dashboard"
      />
      <PrivateRouter
        component={StationListView}
        exact
        layout={MainLayout}
        operationName = 'GET_ALL_STATIONS'
        path = "/stations"
      />
      {/* <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      /> */}
      <PublicRouter
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <PublicRouter
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <PublicRouter
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
