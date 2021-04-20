import React, { useEffect, useState } from "react";
import ManageOrderItems from "../components/manage-orders/ManageOrderItems";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import Tab from "../components/Tab";
import { orderTabs } from "../helpers";
import { usePagination } from "../hooks/usePagination";
import { useSelectTab } from "../hooks/useSelectTab";
import { useOrdersCountsContext } from "../state/orderCounts-context";
import { useOrdersContext } from "../state/orders-context";
import { useSearchContext } from "../state/search-context";
import { Order, OrderTab } from "../types";
import { orderTabType } from "./Order";

interface Props {}

export const ordersPerPage = 10;

const ManageOrders: React.FC<Props> = () => {
  const {
    ordersState: { orders, loading, error, queryMoreOrders },
  } = useOrdersContext();
  const { searchedItems } = useSearchContext();

  const {
    ordersCountsState: { orderCounts },
  } = useOrdersCountsContext();

  const { activeTab } = useSelectTab<OrderTab>(orderTabType, "All");
  const [ordersByTab, setOrdersByTab] = useState(
     orders 
  );
  const { page, totalPages } = usePagination<OrderTab, Order>(
    orderCounts,
    ordersPerPage,
    activeTab,
    searchedItems as Order[]
  );
  const [paginatedSearchedItems, setPaginatedSearchItems] = useState(
    searchedItems
  );
  //filtro ordini in base alla tab es new ecc
  useEffect(() => {
    const startIndex = ordersPerPage * (page - 1);
    const endIndex = ordersPerPage * page;
    if (searchedItems) {
      setPaginatedSearchItems(searchedItems.slice(startIndex, endIndex));
      setOrdersByTab([]);
    } else {
      if (!orders) {
        setOrdersByTab(null);
        return;
      }
      //controllo se devo recuperare altri ordini 
      if (orders.length < orderCounts && orders.length < ordersPerPage * page){
        return queryMoreOrders()
      }

      if (activeTab === "All")
        setOrdersByTab(orders.slice(startIndex, endIndex));
      else
        setOrdersByTab(
          orders.filter((order) => order.shipmentStatus === activeTab)
        );
        // se tolgo ricerca resetto allo state originale
        setPaginatedSearchItems(null)
    }
  }, [activeTab, orders, setOrdersByTab, page, searchedItems, orderCounts]);

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
              withPagination={true}
            />
          ))}
        </div>
      </div>

      <div className="orders-pagination">
        {activeTab === "All" && (
          <Pagination
            page={page}
            totalPages={totalPages}
            tabType={orderTabType}
            activeTab={activeTab}
          />
        )}
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
        {paginatedSearchedItems ? (
          <>
            {paginatedSearchedItems.length < 1 ? (
              <h2 className="header--center">Nessun Ordine</h2>
            ) : (
              (paginatedSearchedItems as Order[]).map((order) => (
                <ManageOrderItems key={order.id} order={order} />
              ))
            )}
          </>
        ) : (
          ordersByTab &&
          ordersByTab.map((order) => (
            <ManageOrderItems key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};
export default ManageOrders;
