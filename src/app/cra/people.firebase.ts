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
