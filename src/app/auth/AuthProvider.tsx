import { useState } from 'react';

import firebase from '@/firebase';

import { PageLogin } from './PageLogin';

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(true);

  firebase.auth().onIdTokenChanged((user) => {
    if (!user || !user.email.endsWith('@bearstudio.fr')) {
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  });

  return isLogged ? children : <PageLogin />;
};
