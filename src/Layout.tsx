import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainNav from "./components/nav/MainNav";
import UserDropdown from "./components/nav/UserDropdown";
import { openUserDropdown, useAuthContext } from "./state/auth-context";
import { useModalContext } from "./state/modal-context";
import ViewContextProvider from "./state/view-context";

interface Props {}

const Layout: React.FC<Props> = ({ children }) => {
  const {modal} = useModalContext();
  const {authState:{IsUserDropdownOpen},authDispatch} = useAuthContext();
  const location = useLocation()

  useEffect(() =>{
    if (IsUserDropdownOpen) authDispatch(openUserDropdown(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location.pathname])

  
  /* 
  ? l'espressione {modal && modal} significa:
  ? se il modal esiste nello state (è stato richiamato)
  ? allora fai vedere il modale stesso, se no non mostrare nulla
  */
  return (
    <div>
      <ViewContextProvider>
        <MainNav />
        {IsUserDropdownOpen &&  <UserDropdown />}
      </ViewContextProvider>
     
      <div className="page">{children}</div>

      {modal && modal}
    </div>
  );
};

export default Layout;
