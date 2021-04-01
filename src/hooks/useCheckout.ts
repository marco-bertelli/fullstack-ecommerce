import { Stripe } from "@stripe/stripe-js";
import { functions } from "../firebase/config";
import { CreatePaymentIntentData, PaymentMethod } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const completePayment = async (
    createPaymentIntentData: CreatePaymentIntentData,
    stripe: Stripe,
    payment_method: PaymentMethod,
    save: boolean | undefined
  ) => {
    try {
      setLoading(true);

      //richiamo cloud function per ottenere client secret
      const createPaymentIntents = functions.httpsCallable(
        "createPaymentIntents"
      );

      const paymentIntent = (await createPaymentIntents(
        createPaymentIntentData
      )) as {
        data: {
          clientsSecret: string;
        };
      };

      if (!paymentIntent.data.clientsSecret) return;

      // confermo pagamento
      const confirmPayment = await stripe.confirmCardPayment(paymentIntent.data.clientsSecret, {
        payment_method,
        save_payment_method: save,
      });
      // controllo se andato a buon fine
      if(confirmPayment?.error?.message){
        setError(confirmPayment.error.message)
        setLoading(false)
        return false
      }

      if(confirmPayment.paymentIntent?.status === 'succeeded'){
        setLoading(false);
        return true
      }

      return false;
      
    } catch (error) {
      setError("qualcosa è andato storto");
      setLoading(false);

      return false;
    }
  };
  return { completePayment, loading, error };
};
