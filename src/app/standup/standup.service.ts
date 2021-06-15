import Axios from 'axios';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import { Project, Speaker } from './standup.types';

const ENDPOINT_STANDUP_PROJECTS = 'https://api.npoint.io/ad43d8dfafb526a7323c';
const ENDPOINT_STANDUP_SPEAKERS = 'https://api.npoint.io/6c13d8f51cd9c46d2c3d';

export const useProjects = (config: UseQueryOptions<Project[]> = {}) => {
  return useQuery(
    ['projects'],
    (): Promise<Project[]> => Axios.get(ENDPOINT_STANDUP_PROJECTS),
    {
      ...config,
    }
  );
};

export const useSpeakers = (config: UseQueryOptions<Speaker[]> = {}) => {
  return useQuery(
    ['speakers'],
    (): Promise<Speaker[]> => Axios.get(ENDPOINT_STANDUP_SPEAKERS),
    {
      ...config,
    }
  );
};

export const useSpeaker = (
  id: number,
  config: UseQueryOptions<Speaker> = {}
) => {
  return useQuery(
    ['speaker', id],
    (): Promise<Speaker> =>
      Axios.get(ENDPOINT_STANDUP_SPEAKERS).then((response) => {
        const speakers = (response as unknown) as Speaker[];
        return speakers?.find((speaker) => speaker?.id === id);
      }),
    {
      enabled: !!id,
      ...config,
    }
  );
};

export const useAddProject = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const { data: projects } = useProjects();
  const queryCache = useQueryClient();
  return useMutation(
    (name) =>
      Axios.post(ENDPOINT_STANDUP_PROJECTS, [
        ...projects,
        { name, id: projects?.length },
      ]),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
      },
    }
  );
};

export const useAddSpeaker = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const { data: speakers } = useSpeakers();
  const queryCache = useQueryClient();
  return useMutation(
    (name) =>
      Axios.post(ENDPOINT_STANDUP_SPEAKERS, [
        ...speakers,
        { name, id: speakers?.length },
      ]),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('speakers');
      },
    }
  );
};

export const useSpeakerDelete = (
  config: UseMutationOptions<number, unknown, number> = {}
) => {
  const queryCache = useQueryClient();
  const { data: speakers } = useSpeakers();
  return useMutation(
    (id) =>
      Axios.post(
        ENDPOINT_STANDUP_SPEAKERS,
        speakers?.filter((speaker) => speaker?.id !== id)
      ),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('speakers');
      },
    }
  );
};

export const useProjectDelete = (
  config: UseMutationOptions<number, unknown, number> = {}
) => {
  const queryCache = useQueryClient();
  const { data: projects } = useProjects();
  return useMutation(
    (id) =>
      Axios.post(
        ENDPOINT_STANDUP_SPEAKERS,
        projects?.filter((project) => project?.id !== id)
      ),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
      },
    }
  );
};
