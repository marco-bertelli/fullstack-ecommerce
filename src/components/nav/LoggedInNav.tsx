import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import { calculateCartQuantity, isClient } from "../../helpers";
import { useAuthContext, openUserDropdown } from "../../state/auth-context";
import { useCartContext } from "../../state/CartContext";
import { useViewContext } from "../../state/view-context";


interface Props {}

const LoggedInNav: React.FC<Props> = () => {
const {authDispatch,authState:{userRole}} = useAuthContext()
const {viewMode} = useViewContext() 
const {cart} = useCartContext()

  return (
    <ul className="navbar">
      
        <div className="navbar__lists">
         {(viewMode === 'client' || isClient(userRole)) && <li className="list list--cart">
            <NavLink to="/buy/my-cart">
              <FontAwesomeIcon
                icon={["fas", "cart-arrow-down"]}
                color="white"
                size="lg"
              />
            </NavLink>
            <div className="cart-qty">{cart && calculateCartQuantity(cart)}</div>
          </li>}
        </div>
      

      <div className="navbar__list"></div>
      <div className="navbar__profile">
      
          <div className="profile">
            <FontAwesomeIcon
              icon={["fas", "user-circle"]}
              color="white"
              size="2x"
              onClick={()=>authDispatch(openUserDropdown(true))}
            />
          </div>
        
      </div>
    </ul>
  );
};

export default LoggedInNav;
