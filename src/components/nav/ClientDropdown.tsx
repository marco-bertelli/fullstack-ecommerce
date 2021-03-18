import React from "react";
import { NavLink } from "react-router-dom";

interface Props {}

const ClientDropdown: React.FC<Props> = () => {
 
  return (
    <div className="sidebar__section sidebar__section--nav">
      <li className="list">
        <NavLink to="/products" className="list-link">
          PRODOTTI
        </NavLink>
      </li>

      <li className="list">
        <NavLink to="/buy/cart" className="list-link">
          MY-CART
        </NavLink>
      </li>

      <li className="list">
        <NavLink to="/orders/my-orders" className="list-link">
          ORDINI
        </NavLink>
      </li>
    </div>
  );
};

export default ClientDropdown;
