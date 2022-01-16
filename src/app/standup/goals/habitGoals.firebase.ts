import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { HabitGoal } from './goals.types';

const goalsCollectionRef = firebase?.firestore?.()?.collection('habitGoals');

const getHabitGoals = async (): Promise<any> => {
  const snapshot = await goalsCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    created: doc.data().created?.seconds,
    dateLastReset: doc.data().dateLastReset?.seconds,
  }));
};

export const useHabitGoals = (config: UseQueryOptions<HabitGoal[]> = {}) => {
  return useQuery(['habitGoals'], (): Promise<HabitGoal[]> => getHabitGoals(), {
    ...config,
  });
};

const addHabitGoal = (payload: HabitGoal): any => {
  return goalsCollectionRef?.add({
    ...payload,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    dateLastReset: firebase.firestore.FieldValue.serverTimestamp(),
    numberOfReset: 0,
  });
};

export const useHabitGoalAdd = (
  config: UseMutationOptions<HabitGoal, unknown, HabitGoal> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((payload) => addHabitGoal(payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('habitGoals');
    },
  });
};

const deleteGoal = (id: string): any => {
  return goalsCollectionRef?.doc(id).delete();
};

export const useHabitGoalDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteGoal(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('habitGoals');
    },
  });
};

const updateHabitGoal = (id, payload) => {
  return goalsCollectionRef?.doc(id)?.update({ ...payload });
};

export const useHabitGoalUpdate = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ id, payload }) => updateHabitGoal(id, { ...payload }), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('habitGoals');
    },
  });
};

const resetHabitGoal = (id) => {
  return goalsCollectionRef
    ?.doc(id)
    ?.update({
      dateLastReset: firebase.firestore.FieldValue.serverTimestamp(),
      numberOfReset: firebase.firestore.FieldValue.increment(1),
    });
};

export const useHabitGoalReset = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => resetHabitGoal(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('habitGoals');
    },
  });
};

const deleteHabitGoalList = async (ids: string[]): Promise<void> => {
  await ids?.map((id) => goalsCollectionRef?.doc(id).delete());
};

export const useGoalDeleteList = (
  config: UseMutationOptions<void, unknown, string[]> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(async (ids) => await deleteHabitGoalList(ids), {
    ...config,
    onSuccess: () => {
      setTimeout(() => queryCache.invalidateQueries('habitGoals'), 100);
    },
  });
};
