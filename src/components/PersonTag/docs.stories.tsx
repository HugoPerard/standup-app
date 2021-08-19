import React from 'react';

import { PersonTag } from '.';

export default {
  title: 'Components/PersonTag',
};

export const Default = () => <PersonTag>Name</PersonTag>;

export const Removable = () => <PersonTag onRemove={() => {}}>Name</PersonTag>;
