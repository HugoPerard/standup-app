import React from 'react';

import { Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { Route } from '@/app/router';
import { Routes } from '@/app/routes';
import { PageGoals } from '@/app/standup/goals/PageGoals';
import { PageThanks } from '@/app/standup/thanks/PageThanks';
import { Error404 } from '@/errors';

import { PageStandup } from './PageStandup';
import { StandupNav } from './_partials/StandupNav';

const StandupRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <StandupNav />
      <Switch>
        <Route
          exact
          path={`${path}/`}
          render={() => <Redirect to={Routes.STANDUP_GOALS} />}
        />
        <Route path={Routes.STANDUP_GOALS} render={() => <PageGoals />} />
        <Route path={Routes.STANDUP_SPEAKING} render={() => <PageStandup />} />
        <Route path={Routes.STANDUP_THANKS} render={() => <PageThanks />} />

        <Route path="*" render={() => <Error404 />} />
      </Switch>
    </>
  );
};

export default StandupRoutes;
