import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import firebase from '@/firebase';

import { Project, Speaker } from './standup.types';

const projectsCollectionRef = firebase?.firestore?.()?.collection('projects');

const getProjects = async (): Promise<any> => {
  const snapshot = await projectsCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const useProjects = (config: UseQueryOptions<Project[]> = {}) => {
  return useQuery(['projects'], (): Promise<Project[]> => getProjects(), {
    ...config,
  });
};

const addProject = (projectName: string): any => {
  return projectsCollectionRef?.add({ name: projectName });
};

export const useProjectAdd = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((name) => addProject(name), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('projects');
    },
  });
};

const updateProject = (id: string, name: string): any => {
  return projectsCollectionRef?.doc(id).update({
    name,
  });
};

export const useProjectUpdate = (
  config: UseMutationOptions<
    Project,
    unknown,
    Pick<Project, 'id' | 'name'>
  > = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(
    (project: Project) => updateProject(project.id, project.name),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
      },
    }
  );
};

const deleteProject = async (id: string): Promise<any> => {
  const snapshot = await speakersCollectionRef
    .where('projectId', '==', id)
    .get();
  snapshot.docs.map((doc) => updateSpeaker(doc?.id, { projectId: '0' }));
  return projectsCollectionRef?.doc(id).delete();
};

export const useProjectDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteProject(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries(['projects', 'speakers']);
    },
  });
};

const speakersCollectionRef = firebase?.firestore?.()?.collection('speakers');

const getSpeakers = async (projectId = null): Promise<any> => {
  const snapshot = projectId
    ? await speakersCollectionRef.where('projectId', '==', projectId).get()
    : await speakersCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const useSpeakers = (
  projectId: string = null,
  config: UseQueryOptions<Speaker[]> = {}
) => {
  return useQuery(
    ['speakers', projectId],
    (): Promise<Speaker[]> => getSpeakers(projectId),
    {
      ...config,
    }
  );
};

const addSpeaker = (payload: Speaker): any => {
  return speakersCollectionRef?.add({ ...payload, index: 0 });
};

export const useSpeakerAdd = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((payload) => addSpeaker(payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('speakers');
    },
  });
};

const deleteSpeaker = (id: string): any => {
  return speakersCollectionRef?.doc(id).delete();
};

export const useSpeakerDelete = (
  config: UseMutationOptions<string, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteSpeaker(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('speakers');
    },
  });
};

const updateSpeaker = (id, payload) => {
  return speakersCollectionRef?.doc(id)?.update({ ...payload });
};

export const useSpeakerUpdate = (
  config: UseMutationOptions<any, unknown, any> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ id, payload }) => updateSpeaker(id, { ...payload }), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('speakers');
    },
  });
};
