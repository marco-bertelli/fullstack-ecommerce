import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ManageProducts from "../pages/ManageProducts";
import ManageOrders from "../pages/ManageOrders";
import ManageOrderDetail from "../pages/ManageOrderDetail";
import ManageUsers from "../pages/ManageUsers";
import PageNotFound from "../pages/PageNotFound";
import { Role } from "../types";
import { isAdmin } from "../helpers";
import OrdersContextProvider from "../state/orders-context";
import OrdersCountsContextProvider from "../state/orderCounts-context";

interface Props {}

const AdminRoutes: React.FC<Props> = (props) => {
  const { userRole } = props as { userRole: Role | null };

  if (!isAdmin(userRole)) return <Redirect to="/buy/my-cart" />;

  return (
    <Switch>
      <Route path="/admin/manage-products">
        <ManageProducts />
      </Route>

      <Route path="/admin/manage-orders/:id">
        <OrdersContextProvider>
          <ManageOrderDetail />
        </OrdersContextProvider>
      </Route>

      <Route path="/admin/manage-orders">
        <OrdersContextProvider>
          <OrdersCountsContextProvider>
            <ManageOrders />
          </OrdersCountsContextProvider>
        </OrdersContextProvider>
      </Route>

      <Route path="/admin/manage-users">
        <ManageUsers />
      </Route>

      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
};

export default AdminRoutes;
