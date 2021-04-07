import { useAsyncCall } from "./useAsyncCall"

export const useRemoveCard = () =>{
    const {loading, setLoading, error, setError} = useAsyncCall()

    const removeCard = async (payment_method: string) =>{
        try{
            setLoading(true)

        } catch (error) {

        }
    }
}