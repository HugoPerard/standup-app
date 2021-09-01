import React, { Suspense } from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { Route, RoutePublic } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

import AdministrativeRoutes from './administrative/AdministrativeRoutes';
import { PageCRA } from './cra/PageCRA';
import OfficesRoutes from './offices/OfficesRoutes';
import { Routes } from './routes';
import StandupRoutes from './standup/StandupRoutes';

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/app/">
        <Layout>
          <Suspense fallback={<Loader />}>
            <Switch>
              <RoutePublic
                exact
                path="/"
                render={() => <Redirect to={Routes.STANDUP} />}
              />

              <Route path={Routes.STANDUP} render={() => <StandupRoutes />} />

              <Route path={Routes.CRA} render={() => <PageCRA />} />

              <Route path={Routes.OFFICES} render={() => <OfficesRoutes />} />

              <Route
                path={Routes.ADMINISTRATIVE}
                render={() => <AdministrativeRoutes />}
              />

              <RoutePublic path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </ErrorBoundary>
  );
};
