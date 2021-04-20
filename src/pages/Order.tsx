import React, { useEffect, useState } from "react";
import OrderItem from "../components/orders/OrderItem";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { orderTabs } from "../helpers";
import { useSelectTab } from "../hooks/useSelectTab";
import { useOrdersContext } from "../state/orders-context";
import { OrderTab } from "../types";

export const orderTabType = "type";
interface Props {}

const Order: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error },
  } = useOrdersContext();
  const { activeTab } = useSelectTab<OrderTab>(orderTabType, "New");
  const [ordersByTab, setOrdersByTab] = useState(orders ? orders.filter(order => order.shipmentStatus === 'New') : null)
  // filtro ordini per tab selezionata 
  useEffect(() => {
    if (!orders){
      setOrdersByTab(null)
      return
    }

    if(activeTab === 'All') setOrdersByTab(orders)
    else setOrdersByTab(orders.filter(order => order.shipmentStatus === activeTab ))
  },[activeTab, orders, setOrdersByTab])
  
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
          <div className="orders-column">
            <h3 className="header--center">Quantità</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">Totale</h3>
          </div>
          <div className="orders-column">
            <h3 className="header--center">Stato spedizione</h3>
          </div>
        </div>

        {/* ordini */}
        {ordersByTab && ordersByTab.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Order;
