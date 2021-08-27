import React from 'react';

import Head from 'next/head';
import { Switch } from 'react-router-dom';

import { Route } from '@/app/router';
import { Routes } from '@/app/routes';
import { Error404 } from '@/errors';

import { PageExpensesReport } from './PageExpensesReport';

const OfficesRoutes = () => {
  return (
    <>
      <Head>
        <title>BS | Note de frais</title>
      </Head>
      <Switch>
        <Route
          path={Routes.EXPENSES_REPORT}
          render={() => <PageExpensesReport />}
        />
        <Route path="*" render={() => <Error404 />} />
      </Switch>
    </>
  );
};

export default OfficesRoutes;
