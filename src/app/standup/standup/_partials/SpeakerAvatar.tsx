import { Avatar, AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';

import { useSpeakerUpdate } from '@/app/standup/standup/standup.firebase';
import { Speaker } from '@/app/standup/standup/standup.types';
import { Icon } from '@/components';

interface SpeakerAvatarProps extends AvatarProps {
  speaker: Speaker;
  hasBadge?: boolean;
}

export const SpeakerAvatar: React.FC<SpeakerAvatarProps> = ({
  speaker,
  hasBadge = false,
  ...rest
}) => {
  const { mutate: updateSpeaker } = useSpeakerUpdate();

  const handleAbsent = () => {
    updateSpeaker({
      id: speaker.id,
      payload: { isAbsent: !speaker?.isAbsent },
    });
  };

  return (
    <Avatar name={speaker?.name} src={speaker?.photoURL} {...rest}>
      {hasBadge && (
        <AvatarBadge
          borderColor={speaker?.isAbsent ? 'red.200' : 'green.200'}
          bg={speaker?.isAbsent ? 'red.500' : 'green.500'}
          boxSize="1.25em"
          onClick={() => handleAbsent()}
          cursor="pointer"
        >
          <Icon
            icon={speaker?.isAbsent ? FiX : FiCheck}
            fontSize="sm"
            color="gray.50"
          />
        </AvatarBadge>
      )}
    </Avatar>
  );
};
