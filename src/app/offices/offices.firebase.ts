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

const addPersonOnOffice = async (
  person: OfficeWorker,
  day,
  officeId: string
) => {
  const officeRef = officesCollectionRef.doc(officeId);
  const office = await officeRef?.get();
  const presence: any = office?.data().presence;
  return officeRef.update({
    presence: {
      ...presence,
      [day]: [
        ...(presence[day] || []).filter((p) => p?.name !== person.name),
        person,
      ],
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

const removePersonOnOffice = async (
  person: OfficeWorker,
  day,
  officeId: string
) => {
  const officeRef = officesCollectionRef.doc(officeId);
  const office = await officeRef?.get();
  const presence: any = office?.data().presence;
  return officeRef.update({
    presence: {
      ...presence,
      [day]: [...(presence[day] || []).filter((p) => p?.name !== person.name)],
    },
  });
};

export const useRemovePersonOnOffice = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(
    ({ person, day, officeId }) => removePersonOnOffice(person, day, officeId),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('offices');
      },
    }
  );
};
