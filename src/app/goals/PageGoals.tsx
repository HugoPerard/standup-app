import React from 'react';

import { Stack } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Loader, Page, PageContent } from '@/app/layout';
import { GoalGroup } from '@/components/GoalGroup';

import { Goal } from './goal.types';
import { useGoals } from './goals.firebase';

const DAY_FORMAT = 'DD-MM-YYYY';

export const PageGoals = () => {
  const firstDayCurrentWeek = dayjs().startOf('week');

  const { data: goals, isLoading: isLoadingGoals } = useGoals();
  const pastGoals = goals?.filter((goal) =>
    dayjs(goal?.date)?.isBefore(firstDayCurrentWeek)
  );

  const groupByDay = (goals: Goal[]) => {
    return (goals || [])
      .reduce((groups: { date: string; goals: Goal[] }[], goal: Goal) => {
        let group = groups.find((g) => g.date === goal.date);
        if (group) {
          group.goals.push(goal);
          return [...groups];
        } else {
          group = {
            date: goal.date,
            goals: [goal],
          };
          return [...groups, group];
        }
      }, [])
      ?.sort(({ date }, { date: otherDate }) =>
        dayjs(date, DAY_FORMAT).isAfter(dayjs(otherDate, DAY_FORMAT)) ? 1 : -1
      );
  };

  const groupedGoals = groupByDay(goals);

  if (isLoadingGoals) {
    return <Loader />;
  }
  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        <Stack spacing={6}>
          <GoalGroup name="Semaine dernière" goals={pastGoals} />
          {groupedGoals.map(({ date, goals }) => (
            <GoalGroup
              name={dayjs(date, 'DD-MM-YYYY').format('dddd D MMMM')}
              goals={goals}
            />
          ))}
        </Stack>
      </PageContent>
    </Page>
  );
};
