import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Pagination from "../components/Pagination";
import ProductItem from "../components/products/ProductItem";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { productTabs } from "../helpers";
import { usePagination } from "../hooks/usePagination";
import { useSelectTab } from "../hooks/useSelectTab";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
import { useProductContext } from "../state/product-context";
import { useSearchContext } from "../state/search-context";
import { Product, ProductTab } from "../types";

export const prodTabType = "cat";

export const perPage = 6;
interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  const history = useHistory<{ from: string }>();
  const { state } = history.location;
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext();
  const {
    productsState: { products, loading, productCounts, queryMoreProducts },
  } = useProductContext();

  const { searchedItems } = useSearchContext();
  const { activeTab } = useSelectTab<ProductTab>(prodTabType, "All");

  const [productsByCat, setProductsByCat] = useState(products[activeTab]);
  const [paginetedSearchedItems, setPaginatedSearchItems] = useState(
    searchedItems
  );

  const { page, totalPages } = usePagination<ProductTab, Product>(
    productCounts[activeTab],
    perPage,
    activeTab,
    searchedItems as Product[]
  );
  //aprire il pop-up quando un utente viene rendirizzato
  useEffect(() => {
    //open sign-in modal dopo redirect dell'utente
    if (!signoutRedirect) {
      if (state?.from) {
        if (!authUser) setModalType("signin");
        else history.push(state.from);
      }
    } else {
      //se è un redirect cancello la pagina da dove sono venuto
      history.replace("/", undefined);
    }
  }, [setModalType, state, authUser, history, signoutRedirect]);

  // quando cambio tab cambio prodotti
  useEffect(() => {
    const startIndex = perPage * (page - 1);
    const endIndex = perPage * page;
    if (searchedItems) {
      setPaginatedSearchItems(searchedItems.slice(startIndex, endIndex));
      setProductsByCat([]);
    } else {
      if (
        products[activeTab].length < productCounts[activeTab] &&
        products[activeTab].length < perPage * page
      ) {
        //recuperare altri prodotti
        return queryMoreProducts()
      }
      setProductsByCat(products[activeTab].slice(startIndex, endIndex));
      setPaginatedSearchItems(null);
    }
  }, [activeTab, products, page, searchedItems, productCounts]);

  if (loading) return <Spinner color="grey" width={50} height={50} />;

  if (!loading && products.All.length === 0)
    return <h2 className="header--center">No Products</h2>;
  return (
    <div className="page--products">
      <div className="products-category">
        {productTabs.map((cat) => (
          <Tab
            key={cat}
            label={cat}
            tabType={prodTabType}
            activeTab={activeTab}
            withPagination={true}
          />
        ))}
      </div>

      <div className="pagination-container">
        <Pagination
          page={page}
          totalPages={totalPages}
          tabType={searchedItems ? undefined : prodTabType}
          activeTab={searchedItems ? undefined : activeTab}
        />
      </div>

      <div className="products">
        {paginetedSearchedItems ? (
          <>
            {paginetedSearchedItems.length < 1 ? (
              <h2 className="header--center">Nessun prodotto trovato</h2>
            ) : (
              (paginetedSearchedItems as Product[]).map((product) => (
                <ProductItem key={product.id} product={product} />
              ))
            )}
          </>
        ) : (
          productsByCat.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
