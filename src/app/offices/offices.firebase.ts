import { useQuery, UseQueryOptions } from 'react-query';

import firebase from '@/firebase';

import { Office } from './offices.types';

const officesCollectionRef = firebase?.firestore?.()?.collection('offices');

const getOffices = async (): Promise<any> => {
  const snapshot = await officesCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const useOffices = (config: UseQueryOptions<Office[]> = {}) => {
  return useQuery(['offices'], (): Promise<Office[]> => getOffices(), {
    ...config,
  });
};
