import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import MyCart from "../pages/MyCart";
import SelectAdress from "../pages/SelectAdress";
import Checkout from "../pages/Checkout";
import PageNotFound from "../pages/Checkout";
import { Role } from "../types";
import { isClient } from "../helpers";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface Props {}
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const BuyRoutes: React.FC<Props> = (props) => {
  const { userRole } = props as { userRole: Role | null };

  if (!isClient(userRole)) return <Redirect to="/" />;

  return (
    <Elements stripe={stripePromise}>
      <Switch>
        <Route path="/buy/my-cart">
          <MyCart />
        </Route>
        <Route path="/buy/select-address">
          <SelectAdress />
        </Route>
        <Route path="/buy/checkout">
          <Checkout />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Elements>
  );
};

export default BuyRoutes;
