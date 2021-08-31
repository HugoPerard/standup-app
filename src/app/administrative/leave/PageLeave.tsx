import React from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { Formiz } from '@formiz/core';
import { Dayjs } from 'dayjs';

import { Page, PageContent } from '@/app/layout';
import { FieldDayPicker, FieldInput, FieldRadios } from '@/components';

const FORM_NOM_ENTRY = '468366344';
const FORM_PRENOM_ENTRY = '1650320565';
const FORM_DATE_BEGIN = '998597328';
const FORM_DATE_BEGIN_DAY = '998597328_day';
const FORM_DATE_BEGIN_MONTH = '998597328_month';
const FORM_DATE_BEGIN_YEAR = '998597328_year';
const FORM_DATE_END = '1229261647';
const FORM_DATE_END_DAY = '1229261647_day';
const FORM_DATE_END_MONTH = '1229261647_month';
const FORM_DATE_END_YEAR = '1229261647_year';
const FORM_TYPE = '790184327_sentinel';

const FORM_TYPE_OPTIONS = [
  { value: 'Matinée seulement' },
  { value: 'Après-midi seulement' },
  { value: 'Toute la journée' },
];

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfVEFq1HJ6cKphUeDquxk3x3BW9UiE4oGkeF8Kp0yVn0PjgLA/viewform';

interface LeaveAppFormValues {
  [FORM_NOM_ENTRY]: string;
  [FORM_PRENOM_ENTRY]: string;
  [FORM_DATE_BEGIN]: Dayjs;
  [FORM_DATE_END]: Dayjs;
  [FORM_TYPE]: string;
}

interface LeaveGoogleFormValues {
  [FORM_NOM_ENTRY]: string;
  [FORM_PRENOM_ENTRY]: string;
  [FORM_DATE_BEGIN_DAY]: number;
  [FORM_DATE_BEGIN_MONTH]: number;
  [FORM_DATE_BEGIN_YEAR]: number;
  [FORM_DATE_END_DAY]: number;
  [FORM_DATE_END_MONTH]: number;
  [FORM_DATE_END_YEAR]: number;
  [FORM_TYPE]: string;
}

const GOOGLE_AGENDA_URL =
  'https://www.google.com/calendar/render?action=TEMPLATE';

export const PageLeave = () => {
  const handleSubmit = (values: LeaveAppFormValues) => {
    const {
      [FORM_DATE_BEGIN]: beginDate,
      [FORM_DATE_END]: endDate,
      ...formRest
    } = values;

    const formatedValues: LeaveGoogleFormValues = {
      ...formRest,
      [FORM_DATE_BEGIN_DAY]: beginDate.get('date'),
      [FORM_DATE_BEGIN_MONTH]: beginDate.get('month') + 1,
      [FORM_DATE_BEGIN_YEAR]: beginDate.get('year'),
      [FORM_DATE_END_DAY]: endDate.get('date'),
      [FORM_DATE_END_MONTH]: endDate.get('month') + 1,
      [FORM_DATE_END_YEAR]: endDate.get('year'),
    };

    window.open(buildGoogleFormUrl(formatedValues), '_blank');
    window.open(buildGoogleAgendaUrl(values), '_blank');
  };

  const buildGoogleFormUrl = (values: LeaveGoogleFormValues) =>
    `${GOOGLE_FORM_URL}?${Object.entries(values)
      ?.map(([key, value]) => `entry.${key}=${value}`)
      .join('&')}`;

  const buildGoogleAgendaUrl = (values: LeaveAppFormValues) =>
    `${GOOGLE_AGENDA_URL}&text=${values[FORM_NOM_ENTRY]} ${
      values[FORM_PRENOM_ENTRY]
    } congés&dates=${values[FORM_DATE_BEGIN].format('YYYYMMDD')}%2F${values[
      FORM_DATE_END
    ].add(1, 'day').format('YYYYMMDD')}`;

  return (
    <Page containerSize="full">
      <PageContent>
        <Formiz autoForm onValidSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="row">
              <FieldInput
                name={FORM_NOM_ENTRY}
                label="Nom"
                required="Le nom est requis"
                defaultValue={localStorage.getItem('leave-lastName')}
                onChange={(value) =>
                  localStorage.setItem('leave-lastName', value)
                }
              />
              <FieldInput
                name={FORM_PRENOM_ENTRY}
                label="Prénom"
                required="Le prénom est requis"
                defaultValue={localStorage.getItem('leave-firstName')}
                onChange={(value) =>
                  localStorage.setItem('leave-firstName', value)
                }
              />
            </Stack>
            <Stack direction="row">
              <FieldDayPicker
                name={FORM_DATE_BEGIN}
                label="Date de début"
                required="La date de début est requise"
              />
              <FieldDayPicker
                name={FORM_DATE_END}
                label="Date de fin"
                required="La date de fin est requise"
              />
            </Stack>
            <FieldRadios
              name={FORM_TYPE}
              options={FORM_TYPE_OPTIONS}
              required="Le type est requis"
            />
            <Button type="submit" variant="@primary">
              Valider
            </Button>
          </Stack>
        </Formiz>
      </PageContent>
    </Page>
  );
};
