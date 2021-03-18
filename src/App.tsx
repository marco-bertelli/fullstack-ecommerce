import React from "react";
import "./App.css";
import Routes from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import './fontawesome';
import ModalContextProvider from "./state/modal-context";
import AuthContextProvider from "./state/auth-context";

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
