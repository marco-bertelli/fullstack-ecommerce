import React from "react";
import ManageOrderItems from "../components/manage-orders/ManageOrderItems";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { orderTabs } from "../helpers";
import { useOrdersContext } from "../state/orders-context";
import { useSearchContext } from "../state/search-context";
import { Order } from "../types";

interface Props {}

const ManageOrders: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error},
  } = useOrdersContext();
  const {searchedItems} = useSearchContext()
  if (loading) return <Spinner color="grey" height={50} width={50} />;

  if (error) return <h2 className="header-center">{error}</h2>;

  if (!orders || orders.length === 0)
    return <h2 className="header--center">Nessun Ordine</h2>;

  return (
    <div className="page--orders">
      <div className="orders-header">
        <h2 className="header header--orders">I tuoi Ordini</h2>

        <div className="orders tab">
        
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
        {searchedItems ? <>
        {searchedItems.length < 1 ? <h2 className="header--center">Nessun Ordine</h2>
          : (searchedItems as Order[]).map((order) => (
            <ManageOrderItems key={order.id} order={order} />
          ))
        }
        
         </> : orders.map((order) => (
          <ManageOrderItems key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
export default ManageOrders;
