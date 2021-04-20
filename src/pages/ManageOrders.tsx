import React, { useEffect, useState } from "react";
import ManageOrderItems from "../components/manage-orders/ManageOrderItems";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { orderTabs } from "../helpers";
import { useSelectTab } from "../hooks/useSelectTab";
import { useOrdersContext } from "../state/orders-context";
import { useSearchContext } from "../state/search-context";
import { Order, OrderTab } from "../types";
import { orderTabType } from "./Order";

interface Props {}

const ManageOrders: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error },
  } = useOrdersContext();
  const { searchedItems } = useSearchContext();

  const { activeTab } = useSelectTab<OrderTab>(orderTabType, "New");
  const [ordersByTab, setOrdersByTab] = useState(
    orders ? orders.filter((order) => order.shipmentStatus === "New") : null
  );
  //filtro ordini in base alla tab es new ecc
  useEffect(() => {
    if (!orders) {
      setOrdersByTab(null);
      return;
    }

    if (activeTab === "All") setOrdersByTab(orders);
    else
      setOrdersByTab(
        orders.filter((order) => order.shipmentStatus === activeTab)
      );
  }, [activeTab, orders, setOrdersByTab]);
  if (loading) return <Spinner color="grey" height={50} width={50} />;

  if (error) return <h2 className="header-center">{error}</h2>;

  if (!orders || orders.length === 0)
    return <h2 className="header--center">Nessun Ordine</h2>;

  return (
    <div className="page--orders">
      <div className="orders-header">
        <h2 className="header header--orders">I tuoi Ordini</h2>

        <div className="orders-tabs">
          {orderTabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              activeTab={activeTab}
              tabType={orderTabType}
            />
          ))}
        </div>
      </div>

      <div className="orders-detail">
        <div className="orders-content">
          <div className="orders-column">
            <h3 className="header--center">Data acquisto</h3>
          </div>
          <div className="orders-column order-column--hide">
            <h3 className="header--center">Quantità</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">Totale</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">Stato spedizione</h3>
          </div>

          <div className="orders-column order-column--hide">
            <h3 className="header--center">Ciente</h3>
          </div>
          <div className="orders-column order-column--manage">
            <h3 className="header--center">Gestisci Ordine</h3>
          </div>
        </div>

        {/* ordini */}
        {searchedItems ? (
          <>
            {searchedItems.length < 1 ? (
              <h2 className="header--center">Nessun Ordine</h2>
            ) : (
              (searchedItems as Order[]).map((order) => (
                <ManageOrderItems key={order.id} order={order} />
              ))
            )}
          </>
        ) : (
          ordersByTab && ordersByTab.map((order) => (
            <ManageOrderItems key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};
export default ManageOrders;
