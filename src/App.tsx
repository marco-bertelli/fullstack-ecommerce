import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import "./fontawesome";
import ModalContextProvider from "./state/modal-context";
import AuthContextProvider from "./state/auth-context";
import ProductsContextProvider from "./state/product-context";
import CartContextProvider from "./state/CartContext";
import SearchContextProvider from "./state/search-context";

function App() {
  return (
    <AuthContextProvider>
      <SearchContextProvider>
        <ModalContextProvider>
          <ProductsContextProvider>
            <CartContextProvider>
              <BrowserRouter>
                <Layout>
                  <Routes />
                </Layout>
              </BrowserRouter>
            </CartContextProvider>
          </ProductsContextProvider>
        </ModalContextProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  );
}

export default App;
