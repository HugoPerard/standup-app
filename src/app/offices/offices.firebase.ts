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

const addOffice = (payload: Office): any => {
  return officesCollectionRef?.add({ presence: {}, ...payload });
};

export const useOfficeAdd = (
  config: UseMutationOptions<Office, unknown, Office> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((payload) => addOffice(payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('offices');
    },
  });
};

const deleteOffice = (id: string): any => {
  return officesCollectionRef?.doc(id).delete();
};

export const useOfficeDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteOffice(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('offices');
    },
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
