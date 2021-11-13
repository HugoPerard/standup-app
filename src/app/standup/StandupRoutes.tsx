import React from 'react';

import Head from 'next/head';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { Route } from '@/app/router';
import { OLD_STANDUP_GOALS, OLD_STANDUP_THANKS, Routes } from '@/app/routes';
import { PageGoals } from '@/app/standup/goals/PageGoals';
import { PageThanks } from '@/app/standup/thanks/PageThanks';
import { Error404 } from '@/errors';

import { StandupNav } from './StandupNav';
import { PageStandup } from './standup/PageStandup';

const StandupRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Head>
        <title>BS | Stand-up</title>
      </Head>
      <StandupNav />
      <Switch>
        <Route
          exact
          path={`${path}/`}
          render={() => <Redirect to={Routes.STANDUP_GOALS} />}
        />
        <Route
          path={OLD_STANDUP_GOALS}
          render={() => <Redirect to={Routes.STANDUP_GOALS} />}
        />
        <Route path={Routes.STANDUP_GOALS} render={() => <PageGoals />} />

        <Route path={Routes.STANDUP_STANDUP} render={() => <PageStandup />} />

        <Route
          path={OLD_STANDUP_THANKS}
          render={() => <Redirect to={Routes.STANDUP_THANKS} />}
        />
        <Route path={Routes.STANDUP_THANKS} render={() => <PageThanks />} />

        <Route path="*" render={() => <Error404 />} />
      </Switch>
    </>
  );
};

export default StandupRoutes;
