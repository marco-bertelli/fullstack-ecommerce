import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useState, KeyboardEvent} from "react";
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

  const [searchString, setSearchString] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };
  const handleSearch = () => {
    if (!searchString) return;

    console.log(searchString);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      return handleSearch()
    }
  }

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
            <input
              type="text"
              className="search"
              placeholder="Search"
              value={searchString}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {searchString && (
              <FontAwesomeIcon
                icon={["fas", "times"]}
                size="lg"
                color="grey"
                className="clear-search"
                onClick={() => setSearchString('')}
              />
            )}
          </div>
          <Button className="btn--search" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <nav className="head__navbar">
          {!authUser ? <LoggedOutNav /> : <LoggedInNav />}
        </nav>
      </div>
    </header>
  );
};

export default MainNav;
