import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ProductItem from "../components/products/ProductItem";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { productTabs } from "../helpers";
import { useSelectTab } from "../hooks/useSelectTab";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
import { useProductContext } from "../state/product-context";
import { useSearchContext } from "../state/search-context";
import { Product, ProductTab } from "../types";

export const prodTabType = "cat";
interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  const history = useHistory<{ from: string }>();
  const { state } = history.location;
  const {
    authState: { authUser, signoutRedirect },
  } = useAuthContext();
  const {
    productsState: { products, loading },
  } = useProductContext();
  const { searchedItems } = useSearchContext();
  const { activeTab } = useSelectTab<ProductTab>(prodTabType, "All");

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

  if (loading) return <Spinner color="grey" width={50} height={50} />;

  if (!loading && products.All.length === 0)
    return <h2 className="header--center">No Products</h2>;
  return (
    <div className="page--products">
      <div className="products-category">
        {productTabs.map((cat) => (
          <Tab key={cat} label={cat} tabType={prodTabType} activeTab={activeTab} />
        ))}
      </div>
      <div className="products">
        {searchedItems ? (
          <>
            {searchedItems.length < 1 ? (
              <h2 className="header--center">Nessun prodotto trovato</h2>
            ) : (
              (searchedItems as Product[]).map((product) => (
                <ProductItem key={product.id} product={product} />
              ))
            )}
          </>
        ) : (
          products.All.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
