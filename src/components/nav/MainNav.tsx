import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import { NavLink } from "react-router-dom";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import { useAuthContext } from "../../state/auth-context";
import { useProductContext } from "../../state/product-context";
import Button from "../Button";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";
import { firebase } from "../../firebase/config";

interface Props {}

const MainNav: React.FC<Props> = () => {
  const {
    authState: { authUser },
  } = useAuthContext();
  const {
    productsDispatch: { setSearchedProducts },
  } = useProductContext();

  const [searchString, setSearchString] = useState("");
  const { searchProducts, loading, error } = useSearchProducts();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };
  const handleSearch = async () => {
    if (!searchString) return;

    const hits = await searchProducts(searchString);

    if (!hits) {
      if (error) alert(error);
      return;
    }

    const products = hits.map((item) => {
      const createdAt = firebase.firestore.Timestamp.fromDate(
        new Date(item.createdAt._seconds * 1000)
      );

      const updatedAt = item.updatedAt ? firebase.firestore.Timestamp.fromDate(
        new Date(item.updatedAt._seconds * 1000)
      ) : undefined

      return {...item,id:item.objectID, createdAt, updatedAt}
    });

    setSearchedProducts(products);
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
                  setSearchedProducts(null);
                }}
              />
            )}
          </div>
          <Button
            className="btn--search"
            onClick={handleSearch}
            loading={loading}
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
