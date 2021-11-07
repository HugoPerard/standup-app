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

const getProjects = async (): Promise<Project[]> => {
  const snapshot = await projectsCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
};

export const useProjects = (config: UseQueryOptions<Project[]> = {}) => {
  return useQuery(['projects'], (): Promise<Project[]> => getProjects(), {
    ...config,
  });
};

const addProject = async (payload: Partial<Project>): Promise<any> => {
  const snapshot = await projectsCollectionRef?.get();
  snapshot?.docs.map((doc) =>
    updateProject(doc?.id, { index: doc?.get('index') + 1 })
  );
  projectsCollectionRef?.add({ ...payload, index: 0 });
};

export const useProjectAdd = (
  config: UseMutationOptions<void, unknown, Partial<Project>> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((payload) => addProject(payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('projects');
    },
  });
};

const updateProject = (id: string, payload: Partial<Project>) => {
  return projectsCollectionRef?.doc(id)?.update(payload);
};

export const useProjectUpdate = (
  config: UseMutationOptions<
    any,
    unknown,
    { id: string; payload: Partial<Project> }
  > = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ id, payload }) => updateProject(id, payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('projects');
    },
  });
};

const deleteProject = async (id: string): Promise<any> => {
  const snapshotSpeakers = await speakersCollectionRef
    .where('projectId', '==', id)
    .get();
  snapshotSpeakers.docs.forEach((doc) =>
    speakersCollectionRef.doc(doc.id).delete()
  );
  const snapshotProject = await projectsCollectionRef?.doc(id).get();
  const projectWithHigherIndex = await projectsCollectionRef
    .where('index', '>', snapshotProject?.get('index'))
    .get();
  projectWithHigherIndex?.docs.map((doc) =>
    updateProject(doc?.id, { index: doc?.data().index - 1 })
  );
  return projectsCollectionRef?.doc(id).delete();
};

export const useProjectDelete = (
  config: UseMutationOptions<void, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteProject(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('projects');
    },
  });
};

const replaceProject = async (project: Partial<Project>, newIndex: number) => {
  if (project?.index === newIndex) {
    return;
  }
  const isReplaceToRight = project?.index < newIndex;

  if (isReplaceToRight) {
    const snapshot = await projectsCollectionRef
      ?.where('index', '>', project?.index)
      ?.where('index', '<=', newIndex)
      .get();
    snapshot.docs.forEach((doc) =>
      updateProject(doc?.id, { index: doc?.get('index') - 1 })
    );
  } else {
    const snapshot = await projectsCollectionRef
      ?.where('index', '<', project?.index)
      ?.where('index', '>=', newIndex)
      .get();
    snapshot.docs.forEach((doc) =>
      updateProject(doc?.id, { index: doc?.get('index') + 1 })
    );
  }
  await updateProject(project?.id, { index: newIndex });
};

export const useProjectReplace = (
  config: UseMutationOptions<
    void,
    unknown,
    { project: Partial<Project>; newIndex: number }
  > = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(
    ({ project, newIndex }) => replaceProject(project, newIndex),
    {
      ...config,
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
      },
    }
  );
};

const speakersCollectionRef = firebase?.firestore?.()?.collection('speakers');

const getSpeakers = async (projectId = null): Promise<Speaker[]> => {
  const snapshot = projectId
    ? await speakersCollectionRef.where('projectId', '==', projectId).get()
    : await speakersCollectionRef.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Speaker[];
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

const addSpeaker = (payload: Partial<Speaker>): any => {
  return speakersCollectionRef?.add({ ...payload });
};

export const useSpeakerAdd = (
  config: UseMutationOptions<Partial<Speaker>, unknown, Partial<Speaker>> = {}
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
  config: UseMutationOptions<void, unknown, string> = {}
) => {
  const queryCache = useQueryClient();
  return useMutation((id) => deleteSpeaker(id), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('speakers');
    },
  });
};

const updateSpeaker = async (id: string, payload: Partial<Speaker>) => {
  const snapshot = await speakersCollectionRef?.doc(id).get();
  const speaker = snapshot?.data();

  if (
    !payload?.projectId ||
    (speaker?.projectId === payload?.projectId &&
      speaker?.index === payload?.index)
  ) {
    await speakersCollectionRef?.doc(id)?.update({ ...payload });
    return (await speakersCollectionRef?.doc(id)?.get()).data();
  }

  if (speaker?.projectId !== payload?.projectId) {
    const snapshotSpeakersOldProject = await speakersCollectionRef
      .where('projectId', '==', speaker?.projectId)
      .where('index', '>', speaker?.index)
      .get();
    snapshotSpeakersOldProject?.docs?.map((doc) =>
      speakersCollectionRef
        ?.doc(doc.id)
        ?.update({ index: doc?.data().index - 1 })
    );
    const snapshotSpeakersNewProject = await speakersCollectionRef
      .where('projectId', '==', payload?.projectId)
      .where('index', '>=', payload?.index)
      .get();
    snapshotSpeakersNewProject?.docs?.map((doc) =>
      speakersCollectionRef
        ?.doc(doc.id)
        ?.update({ index: doc?.data().index + 1 })
    );
  } else {
    const isReplaceToBottom = speaker?.index < payload?.index;

    if (isReplaceToBottom) {
      const snapshot = await speakersCollectionRef
        .where('projectId', '==', speaker?.projectId)
        .where('index', '>', speaker?.index)
        .where('index', '<=', payload?.index)
        .get();
      snapshot.docs.forEach((doc) =>
        speakersCollectionRef
          ?.doc(doc.id)
          ?.update({ index: doc?.data().index - 1 })
      );
    } else {
      const snapshot = await speakersCollectionRef
        .where('projectId', '==', speaker?.projectId)
        .where('index', '<', speaker?.index)
        .where('index', '>=', payload?.index)
        .get();
      snapshot.docs.forEach((doc) =>
        speakersCollectionRef
          ?.doc(doc.id)
          ?.update({ index: doc?.data().index + 1 })
      );
    }
  }

  await speakersCollectionRef?.doc(id)?.update({ ...payload });
  return (await speakersCollectionRef?.doc(id)?.get()).data();
};

export const useSpeakerUpdate = (
  config: UseMutationOptions<
    Speaker[],
    unknown,
    { id: string; payload: Partial<Speaker> }
  > = {}
) => {
  const queryCache = useQueryClient();
  return useMutation(({ id, payload }) => updateSpeaker(id, payload), {
    ...config,
    onSuccess: () => {
      queryCache.invalidateQueries('speakers');
    },
  });
};
