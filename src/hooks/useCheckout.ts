import { Stripe } from "@stripe/stripe-js";
import firebase from "firebase";
import { address_key } from "../components/select-adress/ShippingAddress";
import { cartRef, ordersRef } from "../firebase";
import { db, functions } from "../firebase/config";
import { CartItem, CreatePaymentIntentData, CreatePaymentMethod, UploadOrder } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useCheckout = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();

  const completePayment = async (
   paymentData :{
    createPaymentIntentData: CreatePaymentIntentData,
    stripe: Stripe,
    payment_method: CreatePaymentMethod
   },
    options :{ 
      save: boolean | undefined
      setDefault: boolean | undefined
      customerId?: string
    },
    order:UploadOrder,
    cart: CartItem[]
  ) => {
    const {createPaymentIntentData,stripe, payment_method} = paymentData;
    const {save, setDefault, customerId} = options
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
      const confirmPayment = await stripe.confirmCardPayment(
        paymentIntent.data.clientsSecret,
        {
          payment_method,
          save_payment_method: save,
        }
      );
      // controllo se andato a buon fine
      if (confirmPayment?.error?.message) {
        setError(confirmPayment.error.message);
        setLoading(false);
        return false;
      }

      if (confirmPayment.paymentIntent?.status === "succeeded") {
        if (setDefault) {

          const setDefaultCard = functions.httpsCallable("setDefaultCard")
        
          await setDefaultCard({
            customerId,
            paymentMethod: confirmPayment.paymentIntent?.payment_method
          })
          console.log("carta settata come default")
        }

        //creo nuovo ordine in firestore
        const uploadOrder : UploadOrder={
          ...order,
          paymentStatus:'Success',
          shipmentStatus:'New',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }

        await ordersRef.add(uploadOrder).then(()=>{
          //eliminare il carrello dal firestore
          cartRef.where('user','==', order.user.id).get().then((snapshots)=>{
            const batch = db.batch()

            snapshots.forEach(doc => {
              cart.forEach(item=>item.id === doc.id ? batch.delete(doc.ref) : null)
            });

            return batch.commit()
          })
        })

        window.localStorage.removeItem(address_key)
        setLoading(false);
        return true;
      }

      return false;
    } catch (error) {
      setError(error);
      setLoading(false);

      return false;
    }
  };

  const createStripeCustomerId = async () => {
    try {
      setLoading(true);
      const createStripeCustomer = functions.httpsCallable(
        "createStripeCustomer"
      );

      const stripeCustomerData = (await createStripeCustomer()) as {
        data: { customerId: string };
      };
      
      return stripeCustomerData.data.customerId;
    } catch (error) {
      
      setError(error);
      setLoading(false);

      return undefined;
    }
  };
  return { completePayment, createStripeCustomerId, loading, error };
};
