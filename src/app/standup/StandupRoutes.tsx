import React from 'react';

import { Switch, useRouteMatch } from 'react-router-dom';

import { Route } from '@/app/router';
import { PageStandup } from '@/app/standup/PageStandup';
import { Error404 } from '@/errors';

const StandupRoutes = () => {
  const { url } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={url} render={() => <PageStandup />} />
      <Route path="*" render={() => <Error404 />} />
    </Switch>
  );
};

export default StandupRoutes;
