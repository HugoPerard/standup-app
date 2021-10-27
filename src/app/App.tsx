import React, { Suspense } from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { Route } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

import AdministrativeRoutes from './administrative/AdministrativeRoutes';
import { PageCRA } from './cra/PageCRA';
import OfficesRoutes from './offices/OfficesRoutes';
import { OLD_ADMINISTRATIVE, OLD_OFFICES, Routes } from './routes';
import StandupRoutes from './standup/StandupRoutes';

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/app">
        <Layout>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to={Routes.STANDUP} />}
              />

              <Route path={Routes.STANDUP} render={() => <StandupRoutes />} />

              <Route path={Routes.CRA} render={() => <PageCRA />} />

              <Route
                path={OLD_OFFICES}
                render={() => <Redirect to={Routes.OFFICES} />}
              />
              <Route path={Routes.OFFICES} render={() => <OfficesRoutes />} />

              <Route
                path={OLD_ADMINISTRATIVE}
                render={() => <Redirect to={Routes.ADMINISTRATIVE} />}
              />
              <Route
                path={Routes.ADMINISTRATIVE}
                render={() => <AdministrativeRoutes />}
              />

              <Route path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </ErrorBoundary>
  );
};
