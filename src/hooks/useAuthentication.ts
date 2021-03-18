import { Provider, Role, SignupData } from "../types";
import { auth, functions, firebase } from "../firebase/config";
import { useAsyncCall } from "./useAsyncCall";
import { openUserDropdown, setUserRole, useAuthContext } from "../state/auth-context";

export const useAuthenticate = () => {
  //custom hook
  const {loading,setLoading,error,setError,successMsg,setSuccessMsg,} = useAsyncCall();
  //hook per state {
  const {
    authState: { IsUserDropdownOpen },
    authDispatch,
  } = useAuthContext();

  const signup = async (data: SignupData) => {
    const { username, email, password } = data;

    try {
      setLoading(true);

      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!response) {
        setError("Ops, sembra che qualcosa sia andato storto");
        setLoading(false);
        return;
      }


      //Chiamo la cloud function per creare un nuovo utente in firestore
      const onSignup = functions.httpsCallable("onSignup");

      const data = await onSignup({ username });

      // Update the user displayname in firebase auth
      await auth.currentUser?.updateProfile({
        displayName: username,
      });


      setLoading(false);

      return data;
    } catch (error) {
      //definizione di una variabile a partire dall'errore
      const { message } = error as { message: string };

      setError(message);
      setLoading(false);
    }
  };
  //log-out
  const signout = () => {
    auth
      .signOut()
      .then(() => {
        if (IsUserDropdownOpen) authDispatch(openUserDropdown(false));
      })
      .catch((err) => alert("Sorry, something goes wrong"));
  };

  //logi-in
  const signin = async (data: Omit<SignupData, "username">) => {
    const { email, password } = data;
    try {
      setLoading(true);
      const response = await auth.signInWithEmailAndPassword(email, password);

      if (!response) {
        setError("Ops, sembra che qualcosa sia andato storto");
        setLoading(false);
        return;
      }
      setLoading(false);
      return response;
      
    } catch (error) {
      //definizione di una variabile a partire dall'errore
      const { message } = error as { message: string };

      setError(message);
      setLoading(false);
    }
  };

  //reset passowrd
  const resetPassword = async (
    data: Omit<SignupData, "username" | "password">
  ) => {
    setLoading(true);

    auth
      .sendPasswordResetEmail(data.email)
      .then(() => {
        setSuccessMsg("Email Inviata, controlla la tua mail");
        setLoading(false);
      })
      .catch((error) => {
        //definizione di una variabile a partire dall'errore
        const { message } = error as { message: string };

        setError(message);
        setLoading(false);
      });
  };

  //social login

  const socialLogin = async (provider: Provider) => {
    try {
      setLoading(true);

      const providerObj =
        provider === "facebook"
          ? new firebase.auth.FacebookAuthProvider()
          : provider === "google"
          ? new firebase.auth.GoogleAuthProvider()
          : null

      if (!providerObj) {
        setError("Ops, sembra che qualcosa sia andato storto");
        setLoading(false);
        return;
      }
      const response = await auth.signInWithPopup(providerObj)

      if (!response) {
        setError("Ops, sembra che qualcosa sia andato storto");
        setLoading(false);
        return;
      }

      //Chiamo la cloud function per creare un nuovo utente in firestore
      const onSignup = functions.httpsCallable("onSignup");

      const data = await onSignup({ username : response.user?.displayName });

      setLoading(false);
      console.log("User --> " + response);

      return data;

    } catch (error) {
      //definizione di una variabile a partire dall'errore
      const { message } = error as { message: string };

      setError(message);
      setLoading(false);
    }
  };
  return { signup, signout, signin, resetPassword,socialLogin, loading, error, successMsg };
};
