import { useState } from 'react';

import firebase, { googleAuthProvider } from '@/firebase';

export const useAuth = () => {
  const auth = firebase.auth();

  const [user, setUser] = useState(auth.currentUser);

  auth.onIdTokenChanged((authUser) => {
    setUser(authUser);
  });

  return {
    isLogged: !!user,
    currentUser: user,
    signInWithGoogle: () => auth.signInWithPopup(googleAuthProvider),
    signOut: () => auth.signOut(),
    onAuthStateChanged: (callback) =>
      auth.onAuthStateChanged((authUser) =>
        authUser
          ? callback({
              username: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
            })
          : callback(null)
      ),
    onIdTokenChanged: (callback) =>
      auth.onIdTokenChanged((authUser) =>
        authUser
          ? callback({
              username: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
            })
          : callback(null)
      ),
  };
};

export const useCurrentUser = () => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    return null;
  }
  return {
    username: currentUser.displayName,
    email: currentUser.email,
    photoURL: currentUser.photoURL,
  };
};
