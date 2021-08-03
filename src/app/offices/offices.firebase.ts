import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { Office, OfficeWorker } from './offices.types';

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

const addPersonOnOffice = (person: OfficeWorker, day, officeId: string) => {
  return officesCollectionRef.doc(officeId).update({
    presence: {
      [day]: firebase.firestore.FieldValue.arrayUnion(person),
    },
  });
};

export const useAddPersonOnOffice = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(
    ({ person, day, officeId }) => addPersonOnOffice(person, day, officeId),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('offices');
      },
    }
  );
};
