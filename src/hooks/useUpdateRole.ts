import { functions } from "../firebase/config"
import { Role } from "../types"
import { useAsyncCall } from "./useAsyncCall"

export const useUpdateRole = () => {
    const {loading, setLoading, error, setError} = useAsyncCall()

    const updateRole = async (userId: string, newRole: Role) =>{
        try {
            setLoading(true)

            const updateUserRole = functions.httpsCallable('updateUserRole')

            await updateUserRole({userId, newRole})

            setLoading(false)
            return true;
            
        } catch (error) {

            const { message } = error as { message: string };
            setError(message);
            setLoading(false);
    
            return false;
            
        }
    }
    return {updateRole, loading, error}
}