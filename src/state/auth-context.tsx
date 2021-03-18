import React, {createContext,Dispatch,useEffect,useContext,useReducer} from "react";
import { snapshotToUserInfo, usersRef } from "../firebase";
import { auth } from "../firebase/config";
import { AuthUser, Role, UserInfo } from "../types";

interface Props {}

type FETCH_AUTH_USER = { type: "FETCH_AUTH_USER"; payload: AuthUser | null };
type OPEN_USER_DROPDOWN = { type: "OPEN_USER_DROPDOWN"; payload:boolean}
type FETCH_USER_INFO = { type: "FETCH_USER_INFO"; payload:UserInfo | null}
type SIGNOUT_REDIRECT = {type:'SIGNOUT_REDIRECT'; payload:boolean}
type SET_USER_ROLE = {type:'SET_USER_ROLE'; payload:Role | null}


type AuthAction = FETCH_AUTH_USER | OPEN_USER_DROPDOWN | FETCH_USER_INFO | SIGNOUT_REDIRECT | SET_USER_ROLE;

type AuthState = {
  authUser: AuthUser | null;
  IsUserDropdownOpen : boolean;
  userInfo: UserInfo | null;
  signoutRedirect:boolean;
  userRole: Role | null
};

type AuthDispatch = Dispatch<AuthAction>;

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<AuthDispatch | undefined>(undefined);

// Action creator
/*
? serve per non scrivere ogni volta nell'use effects questo:
! if(user) authDispatch({type: 'FETCH_AUTH_USER',payload: user})
* con questo creatore di azioni riduco la sintassi e la leggibilità del codice:
* if(user) authDispatch(fetchAuthUser(user))
*/

export const fetchAuthUser = (user: AuthUser|null): FETCH_AUTH_USER =>({
    type: 'FETCH_AUTH_USER',
    payload: user 
})

export const openUserDropdown = (open: boolean): OPEN_USER_DROPDOWN =>({
  type: 'OPEN_USER_DROPDOWN',
  payload: open
})

export const fetchUserInfo = (userInfo: UserInfo|null): FETCH_USER_INFO =>({
  type: 'FETCH_USER_INFO',
  payload: userInfo
})

export const signoutRedirect = (redirect: boolean): SIGNOUT_REDIRECT =>({
  type: 'SIGNOUT_REDIRECT',
  payload: redirect
})

export const setUserRole = (role: Role | null): SET_USER_ROLE =>({
  type: 'SET_USER_ROLE',
  payload: role
})

//reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "FETCH_AUTH_USER":
      return {
        ...state,
        authUser: action.payload
      };

    case 'OPEN_USER_DROPDOWN':
        return {
          ...state,
          IsUserDropdownOpen: action.payload
        };
    
    case 'FETCH_USER_INFO':
      return {
        ...state,
        userInfo:action.payload
      };

    case 'SIGNOUT_REDIRECT':
        return {
          ...state,
          signoutRedirect:action.payload
        };

    case 'SET_USER_ROLE':
        return {
          ...state,
          userRole: action.payload
        };

    default:
      return state
  }
};

const initialState: AuthState = {
  authUser: null,
  IsUserDropdownOpen: false,
  userInfo:null,
  signoutRedirect:false,
  userRole:null
};

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  
  //in ascolto del cambio di auth state su firebase
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user)=>{
        if(user) {
          //recuper il ruolo non dal database ma da auth di firebase
          user.getIdTokenResult().then(result=>{
            const role=result.claims.role as Role
            
            authDispatch(setUserRole(role))
          }).catch(()=>authDispatch(setUserRole(null)))
          //setto l'utente
          authDispatch(fetchAuthUser(user))
        }
        else {
          authDispatch(fetchAuthUser(null))
          authDispatch(setUserRole(null))
        }
    })

    return () => unsubscribe()
  },[])

  //in ascolto su user collection in firestore
  useEffect(()=>{
    if(!authState.authUser) return authDispatch(fetchUserInfo(null))

    const unsubscribe = usersRef.doc(authState.authUser.uid).onSnapshot({
      next : (doc) =>{
        if (!doc.exists) return authDispatch(fetchUserInfo(null))

        const userInfo = snapshotToUserInfo(doc);
        /* 
        ! mega fix, quado un utente si registrava con mail e password non prendeva il role 
        */
        const role = userInfo?.role as Role
        authDispatch(setUserRole(role))
        authDispatch(fetchUserInfo(userInfo))
      },
      error: () => authDispatch(fetchUserInfo(null))
    })

    return () => unsubscribe()
  },[authState.authUser])

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => {
    const authState = useContext(AuthStateContext)
    const authDispatch =useContext(AuthDispatchContext)

    if (authDispatch === undefined || authState === undefined) 
    throw new Error('useAuthContext must be used within AuthContextProvider')

    return {authState,authDispatch}
}
