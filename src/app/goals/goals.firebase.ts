import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { Goal } from './goal.types';

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

const addGoal = (description: string, date: string): any => {
  return goalsCollectionRef?.add({ description, date });
};

export const useGoalAdd = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ description, date }) => addGoal(description, date), {
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
