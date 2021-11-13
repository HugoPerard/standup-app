import React from 'react';

import Head from 'next/head';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { Route } from '@/app/router';
import { OLD_ADMINISTRATIVE_LEAVE, Routes } from '@/app/routes';
import { Error404 } from '@/errors';

import { AdministrativeNav } from './_partials/AdministrativeNav';
import { PageLeave } from './leave/PageLeave';

const AdministrativeRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Head>
        <title>BS | Administratif</title>
      </Head>
      <AdministrativeNav />
      <Switch>
        <Route
          exact
          path={`${path}/`}
          render={() => <Redirect to={Routes.ADMINISTRATIVE_LEAVE} />}
        />

        <Route
          exact
          path={OLD_ADMINISTRATIVE_LEAVE}
          render={() => <Redirect to={Routes.ADMINISTRATIVE_LEAVE} />}
        />
        <Route
          path={Routes.ADMINISTRATIVE_LEAVE}
          render={() => <PageLeave />}
        />

        <Route path="*" render={() => <Error404 />} />
      </Switch>
    </>
  );
};

export default AdministrativeRoutes;
