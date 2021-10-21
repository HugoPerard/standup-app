import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { Goal } from './goals.types';

const goalsCollectionRef = firebase?.firestore?.()?.collection('goals');

const getGoals = async (): Promise<any> => {
  const snapshot = await goalsCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const useGoals = (config: UseQueryOptions<Goal[]> = {}) => {
  return useQuery(['goals'], (): Promise<Goal[]> => getGoals(), {
    ...config,
  });
};

const addGoal = (payload: Goal): any => {
  return goalsCollectionRef?.add(payload);
};

export const useGoalAdd = (
  config: UseMutationOptions<Goal, unknown, Goal> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((payload) => addGoal(payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('goals');
    },
  });
};

const deleteGoal = (id: string): any => {
  return goalsCollectionRef?.doc(id).delete();
};

export const useGoalDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteGoal(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('goals');
    },
  });
};

const updateGoal = (id, payload) => {
  return goalsCollectionRef?.doc(id)?.update({ ...payload });
};

export const useGoalUpdate = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ id, payload }) => updateGoal(id, { ...payload }), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('goals');
    },
  });
};

const deleteGoalList = async (ids: string[]): Promise<void> => {
  await ids?.map((id) => goalsCollectionRef?.doc(id).delete());
};

export const useGoalDeleteList = (
  config: UseMutationOptions<void, unknown, string[]> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(async (ids) => await deleteGoalList(ids), {
    ...config,
    onSuccess: () => {
      setTimeout(() => queryCache.invalidateQueries('goals'), 100);
    },
  });
};
