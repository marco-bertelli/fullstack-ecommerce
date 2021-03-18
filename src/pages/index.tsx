import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ProductItem from "../components/products/ProductItem";
import { products } from "../data/products";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
interface Props {}

const Index: React.FC<Props> = () => {

  const {setModalType} = useModalContext();
  const history = useHistory<{from:string}>();
  const {state} = history.location;
  const {authState:{authUser,signoutRedirect}} = useAuthContext();
  
  //aprire il pop-up quando un utente viene rendirizzato
  useEffect(()=>{
    //open sign-in modal dopo redirect dell'utente
    if(!signoutRedirect){
      if(state?.from){
        if (!authUser)setModalType('signin')
        else history.push(state.from)
      }
    } else{
      //se è un redirect cancello la pagina da dove sono venuto
      history.replace('/',undefined)
    }
  },[setModalType,state,authUser,history,signoutRedirect])

  return (
    <div className="page--products">
      <div className="products">
           {products.map(product => <ProductItem key={product.id} product={product} />)}  
      </div>
    </div>
  );

};

export default Index;
