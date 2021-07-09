import firebase, { googleAuthProvider } from '@/firebase';

export const useAuth = () => {
  const auth = firebase.auth();

  return {
    currentUser: auth.currentUser,
    signInWithGoogle: () => auth.signInWithPopup(googleAuthProvider),
    signOut: () => auth.signOut(),
    onAuthStateChanged: (callback) =>
      auth.onAuthStateChanged((authUser) =>
        authUser
          ? callback({
              username: authUser.displayName,
              email: authUser.email,
              photoUrl: authUser.photoURL,
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
    photoUrl: currentUser.photoURL,
  };
};
