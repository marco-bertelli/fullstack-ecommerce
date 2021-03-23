import { cartRef } from "../firebase"
import { UploadCartItem } from "../types"
import { useAsyncCall } from "./useAsyncCall"
import {firebase} from '../firebase/config'

export const useManageCart = () =>{
    const {loading,setLoading, error, setError} = useAsyncCall()

    const addToCart = async (productId:string,quantity:number,userId:string,inventory:number)=>{
       try{

        setLoading(true)

        // prendo il carrello da firestore
        const cartItemRef = cartRef.doc(`${userId}-${productId}`)
        const snapshot = await cartItemRef.get()

        let cartItem : UploadCartItem

        if(!snapshot.exists){
            // il prodotto non esiste devo crearlo
            cartItem = {
                product:productId,
                user: userId,
                quantity:quantity,
                createdAt:firebase.firestore.FieldValue.serverTimestamp()
            }

        } else {
            //prodotto esiste devo aggiornare quantità
            const currentCartItem =snapshot.data() as UploadCartItem

            cartItem = {
                ...currentCartItem,
                quantity: currentCartItem.quantity + quantity >inventory ?inventory : currentCartItem.quantity + quantity,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
             }
        }

        await cartItemRef.set(cartItem)
        setLoading(false)

        return true
       } catch (error) {
            const {message} = error as {message:string}
            setError(message)
            setLoading(false)

            return false
       }
    }
    return {addToCart,loading,error}
}