import React, { Suspense } from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { Route, RoutePublic } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

import { PageGoals } from './goals/PageGoals';
import { PageStandup } from './standup/PageStandup';
import { PageThanks } from './thanks/PageThanks';

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

              <Route path="/standup" render={() => <PageStandup />} />
              <Route path="/objectifs" render={() => <PageGoals />} />
              <Route path="/remerciements" render={() => <PageThanks />} />

              <RoutePublic path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools />
    </ErrorBoundary>
  );
};
