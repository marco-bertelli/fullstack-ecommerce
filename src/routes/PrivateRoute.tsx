import React, { ReactElement } from 'react'
import { Redirect, useLocation } from 'react-router';
import Spinner from '../components/Spinner';
import { useAuthContext } from '../state/auth-context';

interface Props {

}

const PrivateRoute: React.FC<Props> = ({children}) => {
  
    const {authState:{authUser,userRole,authChecked}}= useAuthContext();
    const location = useLocation()
    
    //effetto per aspettare che l'autenticazione sia finita
    

    if (!authChecked && (!authUser || !userRole)) return <Spinner color='grey' height={50} width={50} />

    if(authChecked && (!authUser || !userRole)) return <Redirect to={{
        pathname: '/',
        state:{

            from : location.pathname
        }
    }} />
        return <>{React.Children.map(children as ReactElement, (child)=>React.cloneElement(child,{userRole}))}</>
}

export default PrivateRoute