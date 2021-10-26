import React from 'react';

import { Alert, AlertIcon, Stack } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Loader, Page, PageContent } from '@/app/layout';
import { DATE_FORMAT } from '@/app/shared/constants';
import { GoalGroup } from '@/app/standup/goals/_partials/GoalGroup';

import { useGoals } from './goals.firebase';
import { Goal } from './goals.types';

export const PageGoals = () => {
  const firstDayCurrentWeek = dayjs().startOf('week');
  const weekdays = [...Array(5)].map((_, index) =>
    firstDayCurrentWeek?.add(index, 'day').format(DATE_FORMAT)
  );

  const { data: goals, isLoading: isLoadingGoals } = useGoals();
  const pastGoals = goals?.filter((goal) =>
    dayjs(goal?.date, DATE_FORMAT)?.isBefore(firstDayCurrentWeek)
  );

  const groupByDay = (goals: Goal[]): { date: string; goals: Goal[] }[] => {
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
        dayjs(date, DATE_FORMAT).isAfter(dayjs(otherDate, DATE_FORMAT)) ? 1 : -1
      );
  };

  const groupedGoals = groupByDay(goals);

  return (
    <Page containerSize="full">
      <PageContent>
        {isLoadingGoals ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Alert status="info">
              <AlertIcon />
              On répond par oui ou par non, on ne raconte pas sa vie !
              Cordialement !
            </Alert>
            <GoalGroup
              name="Semaine dernière"
              goals={pastGoals}
              areCompletesClearable
            />
            {weekdays.map((date) => (
              <GoalGroup
                key={date}
                name={dayjs(date, DATE_FORMAT).format('dddd D MMMM')}
                date={date}
                goals={
                  groupedGoals?.find((goalsGroup) => goalsGroup?.date === date)
                    ?.goals
                }
              />
            ))}
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
