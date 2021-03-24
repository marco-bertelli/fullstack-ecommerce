import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { cartRef, snapshotToDoc } from '../firebase';
import { useAsyncCall } from '../hooks/useAsyncCall';
import { CartItem } from '../types';
import { useAuthContext } from './auth-context';
import { useProductContext } from './product-context';

interface Props {

}

type CartState = {
    cart:CartItem[] | null
    loading:boolean
    error:string
}

type CartDispatch = {
    setCart : Dispatch<SetStateAction<CartItem[] | null>>
}

const CartStateContext = createContext<CartState| undefined>(undefined)
const CartDispatchContext = createContext<CartDispatch| undefined>(undefined)

const CartContextProvider: React.FC<Props> = ({children}) => {
    const[cart,setCart] = useState<CartItem[] | null>(null)
    const {authState:{authUser}} = useAuthContext()
    const {loading, setLoading, error, setError} = useAsyncCall()
    const {productsState:{products : {All}}} = useProductContext()

    useEffect(()=>{
        setLoading(true);
        if (!authUser){
            //utente non autenticato
            setCart(null)
            setLoading(false)
            return
        }
        if(All.length === 0) return 

        // utente loggato
        const unsubscribe = cartRef.where('user','==',authUser.uid).orderBy('createdAt','desc').
        onSnapshot({
            next : (snapshots) =>{
                const cart : CartItem[] = []
                snapshots.forEach(snapshot=>{
                   const cartItem = snapshotToDoc<CartItem>(snapshot)
                   const product = All.find(prod=>prod.id === cartItem.product)
                   
                   if(!product) return
                   
                   cart.push({...cartItem,item:product})
                })
               setCart(cart) 
            },
            error: (err) =>{
                setError(err.message)
                setLoading(false)
            }
        })
        return () => unsubscribe()
    },[authUser, setCart, setLoading, setError, All])
    
    return (
            <CartStateContext.Provider value={{cart, loading, error}}>
                <CartDispatchContext.Provider value={{setCart}}>
                    <div>{children}</div>
                </CartDispatchContext.Provider>
            </CartStateContext.Provider>
        );
}

export default CartContextProvider


export const useCartContext = ()=> {
    const cartState = useContext(CartStateContext)
    const cartDispatch = useContext(CartDispatchContext)

    if(cartState === undefined || cartDispatch === undefined ) throw new Error
    ('cartContext must be used without CartContextProvider')

    return {...cartState,...cartDispatch}
}

