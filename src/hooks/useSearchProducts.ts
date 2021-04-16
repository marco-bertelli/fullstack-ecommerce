import { productsIndex } from "../algolia"
import { SearchProduct } from "../types"
import { useAsyncCall } from "./useAsyncCall"

export const useSearchProducts = () => {
    const {loading, setLoading, error, setError} = useAsyncCall()

    const searchProducts = async (searchString: string) => {
        try {
            setLoading(true)

            const result = await productsIndex.search<SearchProduct>(searchString)
            
            setLoading(false)

            return result.hits;

        } catch (error) {

            const { message } = error as { message: string };
            setError(message);
            setLoading(false);
    
            return false;
            
        }
    }
    return {loading, error, searchProducts};
}