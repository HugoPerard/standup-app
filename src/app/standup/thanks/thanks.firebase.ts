import dayjs from 'dayjs';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { Thank } from './thanks.types';

const thanksCollectionRef = firebase?.firestore?.()?.collection('thanks');

const getThanks = async (): Promise<any> => {
  const snapshot = await thanksCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const useThanks = (config: UseQueryOptions<Thank[]> = {}) => {
  return useQuery(['thanks'], (): Promise<Thank[]> => getThanks(), {
    ...config,
  });
};

const addThank = (author: string, type: string): any => {
  return thanksCollectionRef?.add({
    author,
    date: dayjs()?.unix(),
    type,
  });
};

export const useThankAdd = (
  config: UseMutationOptions<Partial<Thank>, unknown, Partial<Thank>> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ author, type }) => addThank(author, type), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('thanks');
    },
  });
};

const deleteThank = (id: string): any => {
  return thanksCollectionRef?.doc(id).delete();
};

export const useThankDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteThank(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('thanks');
    },
  });
};

const deleteAllThanks = async () => {
  const snapshot = await thanksCollectionRef.get();
  return snapshot.docs.map((doc) => deleteThank(doc?.id));
};

export const useThanksDelete = (config: UseMutationOptions<any> = {}) => {
  const queryCache = useQueryClient();
  return useMutation(() => deleteAllThanks(), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('thanks');
    },
  });
};
