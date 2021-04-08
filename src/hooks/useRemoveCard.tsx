import { PaymentMethod } from "@stripe/stripe-js"
import { functions } from "../firebase/config"
import { useAsyncCall } from "./useAsyncCall"

export const useRemoveCard = () =>{
    const {loading, setLoading, error, setError} = useAsyncCall()

    const removeCard = async (paymentMethod: string) =>{
        try{
            setLoading(true)

            const detachPaymentMethod = functions.httpsCallable('detachPaymentMethods')

            const {data:{paymentMethodResult}}=await detachPaymentMethod({paymentMethod}) as {data: {paymentMethodResult: PaymentMethod} }
        
            setLoading(false)

            return paymentMethodResult

        } catch (error) {
            const { message } = error as { message: string };
            setError(message);
            setLoading(false);

            return false;
        }
    }

    return {removeCard, loading, error}
}