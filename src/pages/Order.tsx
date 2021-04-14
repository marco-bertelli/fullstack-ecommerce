import React from "react";
import OrderItem from "../components/OrderItem";
import Spinner from "../components/Spinner";
import { useOrdersContext } from "../state/orders-context";

interface Props {}

const Order: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error },
  } = useOrdersContext();
  if(loading) return <Spinner color='grey' height={50} width={50} />
  
  if(error) return <h2 className="header-center">{error}</h2>
  
  if(!orders || orders.length === 0) return <h2 className="header--center">Nessun Ordine</h2>
  
  return (
    <div className="page--orders">
      <div className="orders-header">
        <h2 className="header header--orders">I tuoi Ordini</h2>

        <div className="orders tab"></div>
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
        {orders.map(order => <OrderItem key={order.id} order={order} />)}
      </div>
    </div>
  );
};

export default Order;
