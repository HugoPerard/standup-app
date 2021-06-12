import React, { Suspense } from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { Route, RoutePublic } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

const StandupRoutes = React.lazy(() => import('@/app/standup/StandupRoutes'));

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
                render={() => <Redirect to="/standup" />}
              />

              <Route path="/standup" render={() => <StandupRoutes />} />

              <RoutePublic path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </ErrorBoundary>
  );
};
