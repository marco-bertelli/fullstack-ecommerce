
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../state/auth-context";
import Button from "../Button";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";

interface Props {}

const MainNav: React.FC<Props> = () => {

  const {
    authState: { authUser },
  } = useAuthContext();

  return (
    <header className="head">
      <div className="head__section">
        <div className="head__logo">
          <NavLink to="/">
            <h2 className="header header--logo">React-M-Shop</h2>
          </NavLink>
        </div>

        <div className="head__search">
          <div className="search-input">
            <input type="text" className="search" placeholder="Search" />
          </div>
          <Button className="btn--search">Search</Button>
        </div>
        <nav className="head__navbar">
          {!authUser ? <LoggedOutNav /> : <LoggedInNav />}
        </nav>
      </div>
    </header>
  );
};

export default MainNav;
