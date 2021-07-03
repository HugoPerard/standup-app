import React from 'react';

import { Formiz } from '@formiz/core';

import { FieldMultiSelect } from '@/components';

const colors = [
  { label: 'Red', value: 'red' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Blue', value: 'blue' },
];

export default {
  title: 'Fields/FieldMultiSelect',
};

export const Default = () => (
  <Formiz>
    <FieldMultiSelect
      name="colors"
      label="Colors"
      placeholder="Placeholder"
      helper="This is an helper"
      required="Color is required"
      options={colors}
      noOptionsMessage="No color"
    />
  </Formiz>
);
