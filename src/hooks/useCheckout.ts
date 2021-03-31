import { functions } from "../firebase/config";
import { CreatePaymentIntentData } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const completePayment = async (
    createPaymentIntentData: CreatePaymentIntentData
  ) => {
    try {
      setLoading(true);

      //richiamo cloud function per ottenere client secret
      const createPaymentIntents = functions.httpsCallable(
        "createPaymentIntents"
      );

      const paymentIntent = await createPaymentIntents(createPaymentIntentData) as {data: {
          clientsSecret:string
      }};
    
      if(!paymentIntent.data.clientsSecret) return 

      console.log(paymentIntent.data.clientsSecret)

      setLoading(false)
    } catch (error) {
        setError('qualcosa è andato storto')
        setLoading(false)

        return false
    }
  };
  return {completePayment,loading,error}
};
