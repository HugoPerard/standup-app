import { useState } from 'react';

import firebase from '@/firebase';

import { PageLogin } from './PageLogin';
import { useAuth } from './useAuth';

export const AuthProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [isLogged, setIsLogged] = useState(!!currentUser);

  firebase.auth().onIdTokenChanged((user) => {
    if (!user || !user.email.endsWith('@bearstudio.fr')) {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  });

  return isLogged ? children : <PageLogin />;
};
