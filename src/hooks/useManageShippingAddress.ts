import { Address, UserInfo } from "../types";
import { useAsyncCall } from "./useAsyncCall";
import { firebase } from "../firebase/config";
import { usersRef } from "../firebase";

export const useManageShippingAddress = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const addNewAddress = async (
    data: Omit<Address, "index">,
    userInfo: UserInfo
  ) => {
    try {
      setLoading(true);

      const updatedUserInfo = {
        shippingAddress: userInfo.shippingAddress
          ? [...userInfo.shippingAddress, data]
          : [data],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      //Update the user document in firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo, { merge: true });

      setLoading(false);

      return true;
    } catch (error) {
      const { message } = error as { message: string };
      setError(message);
      setLoading(false);

      return false;
    }
  };

  const editAddress = async (
    data: Omit<Address, "index">,
    index: number,
    userInfo: UserInfo
  ) => {
    try {
      if (!userInfo.shippingAddress) {
        setError(
          "Ops, sembra che non riesca a modificare questo indirizzo prova ad aggiornare la pagina"
        );
        return false
      }
      setLoading(true);

      // array degli indirizzi
      const currentShippingAddresses = userInfo.shippingAddress

      //update dell'array (solo oggetto selexionato)
      currentShippingAddresses[index] = data

      //info aggiornate
      const updatedUserInfo = { 
        shippingAddress:currentShippingAddresses,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }

      //update user doc su firestore
      await usersRef.doc(userInfo.id).set(updatedUserInfo,{merge:true})

      setLoading(false);

      return true;
    } catch (error) {
      const { message } = error as { message: string };
      setError(message);
      setLoading(false);

      return false;
    }
  };

  return { addNewAddress, editAddress, loading, error };
};
