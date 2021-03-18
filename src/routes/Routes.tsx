import React from "react";
import { Switch, Route } from "react-router-dom";

//librerie per il lazy loading figata!
import { lazy } from "react";
import { Suspense } from "react";
import PrivateRoute from "./PrivateRoute";

interface Props {}

const Routes: React.FC<Props> = () => {

  //lazy loading !
  const Index = lazy(() => import('../pages/index'));
  const Products = lazy(() => import('../pages/Products'));
  const ProductDetail = lazy(() => import('../pages/ProductDetail'));
  const PageNotFound = lazy(() => import('../pages/PageNotFound'));
  const BuyRoutes = lazy(() => import('./BuyRoutes'));
  const OrderRoutes = lazy(() => import('./OrderRoutes'));
  const AdminRoutes = lazy(() => import('./AdminRoutes'));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/buy">
          <PrivateRoute>
            <BuyRoutes />
          </PrivateRoute>
        </Route>

        <Route path="/orders">
          <PrivateRoute>
            <OrderRoutes />
          </PrivateRoute>
        </Route>

        <Route path="/admin">
          <PrivateRoute>
              <AdminRoutes />
          </PrivateRoute>
        </Route>
       

        <Route path="/products/:productId">
          <ProductDetail />
        </Route>

        <Route path="/products">
          <Products />
        </Route>

        <Route exact path="/">
          <Index />
        </Route>

        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default Routes;
