import { useQuery, UseQueryOptions } from 'react-query';

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
