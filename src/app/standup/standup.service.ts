import Axios from 'axios';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import { Project } from './standup.types';

export const useProjects = (config: UseQueryOptions<Project[]> = {}) => {
  return useQuery(
    ['projects'],
    (): Promise<Project[]> =>
      Axios.get('https://api.npoint.io/ad43d8dfafb526a7323c'),
    {
      ...config,
    }
  );
};

export const useUpdateProjects = (
  config: UseMutationOptions<Project[], unknown, Project[]> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(
    (payload) =>
      Axios.post('https://api.npoint.io/ad43d8dfafb526a7323c', payload),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
      },
    }
  );
};
