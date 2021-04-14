import firebase from "firebase";
import { ordersRef } from "../firebase";
import { ShipmentStatus } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useUpdateShipmentStatus = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const updateStatus = async (orderId: string, newStatus: ShipmentStatus) => {
    try {
      setLoading(true);

      await ordersRef
        .doc(orderId)
        .set(
          {
            shipmentStatus: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        setLoading(false)

        return true
    } catch (error) {
        const { message } = error as { message: string };
        setError(message);
        setLoading(false);

        return false;
    }
  };
  return {updateStatus, loading, error}
};
