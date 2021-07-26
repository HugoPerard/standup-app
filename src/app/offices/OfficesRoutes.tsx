import React from 'react';

import Head from 'next/head';
import { Switch } from 'react-router-dom';

import { Route } from '@/app/router';
import { Routes } from '@/app/routes';
import { Error404 } from '@/errors';

import { PageOffices } from './PageOffices';

const OfficesRoutes = () => {
  return (
    <>
      <Head>
        <title>BS | Bureaux</title>
      </Head>
      <Switch>
        <Route path={Routes.OFFICES} render={() => <PageOffices />} />

        <Route path="*" render={() => <Error404 />} />
      </Switch>
    </>
  );
};

export default OfficesRoutes;
