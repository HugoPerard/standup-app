import React, { Suspense } from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { Route, RoutePublic } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

import { PageCRA } from './cra/PageCRA';
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
                render={() => <Redirect to="/objectifs" />}
              />

              <Route path={Routes.STANDUP} render={() => <StandupRoutes />} />

              <Route path="/cra" render={() => <PageCRA />} />

              <RoutePublic path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </ErrorBoundary>
  );
};
