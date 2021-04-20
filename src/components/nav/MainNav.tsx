import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useSearchItems } from "../../hooks/useSearchItems";
import { useAuthContext } from "../../state/auth-context";
import { useSearchContext } from "../../state/search-context";
import Button from "../Button";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";


interface Props {}

const MainNav: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext();
  const {setSearchedItems} = useSearchContext()

  const [searchString, setSearchString] = useState("");
  const location = useLocation()
  const { searchItems, loading, error } = useSearchItems(location.pathname);
  const history = useHistory();
  // effetto cancellare a mano ricerca
  useEffect(()=>{
    if(!searchString){
      setSearchedItems(null)
      history.replace(location.pathname)
    }
  }, [searchString, setSearchedItems, location.pathname, history])

  // effetto avviso errori
  useEffect(()=>{
    if (error) alert (error)
  },[error])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };
  const handleSearch = async () => {
    if (!searchString) return;

    return searchItems(searchString);  
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      return handleSearch();
    }
  };

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
                onClick={() => {
                  setSearchString("")
                  setSearchedItems(null)
                  history.replace(location.pathname)
                }}
              />
            )}
          </div>
          <Button
            className="btn--search"
            onClick={handleSearch}
            loading={loading}
            disabled={loading}
          >
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
