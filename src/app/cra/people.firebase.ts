import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { People } from './people.type';

const peoplesCollectionRef = firebase?.firestore?.()?.collection('people');

const getPeoples = async (): Promise<any> => {
  const snapshot = await peoplesCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const usePeoples = (config: UseQueryOptions<People[]> = {}) => {
  return useQuery(['people'], (): Promise<People[]> => getPeoples(), {
    ...config,
  });
};
console.log(peoplesCollectionRef);
const addPeople = (payload: People): any => {
  return peoplesCollectionRef?.add(payload);
};
