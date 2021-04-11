import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ordersRef, snapshotToDoc } from "../firebase";
import { isAdmin, isClient } from "../helpers";
import { useAsyncCall } from "../hooks/useAsyncCall";
import { Order } from "../types";
import { useAuthContext } from "./auth-context";

interface Props {}

type OrdersState = {
  orders: Order[] | null;
  loading: boolean;
  error: string;
};

type OrdersDispatch = {
  setOrders: Dispatch<SetStateAction<Order[] | null>>;
};

const OrderStateContext = createContext<OrdersState | undefined>(undefined);
const OrdersDispatchContext = createContext<OrdersDispatch | undefined>(
  undefined
);

const OrdersContextProvider: React.FC<Props> = ({ children }) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const { loading, setLoading, error, setError } = useAsyncCall();
  const {
    authState: { userInfo },
  } = useAuthContext();

  useEffect(() => {
    if (!userInfo) return setOrders(null);

    setLoading(true);
    let unsubscribe: () => void

    if (isClient(userInfo.role)) {
      // se utente è un client recupero solo i suoi ORDINI
       unsubscribe = ordersRef
        .where("user.id", "==", userInfo.id)
        .orderBy("createdAt", "desc")
        .onSnapshot({
          next: (snapshots) => {
            const orders: Order[] = [];
            snapshots.forEach((snapshot) => {
              const order = snapshotToDoc<Order>(snapshot);
              orders.push(order);
            });

            setOrders(orders);
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setOrders(null);
            setLoading(false);
          },
        });
    } else if (isAdmin(userInfo.role)) {
      // se admin recupero tutti gli ordini
      unsubscribe = ordersRef
      .orderBy("createdAt", "desc")
      .onSnapshot({
        next: (snapshots) => {
          const orders: Order[] = [];
          snapshots.forEach((snapshot) => {
            const order = snapshotToDoc<Order>(snapshot);
            orders.push(order);
          });

          setOrders(orders);
          setLoading(false);
        },
        error: (err) => {
          setError(err.message);
          setOrders(null);
          setLoading(false);
        },
      });
    }

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrderStateContext.Provider value={{ orders, loading, error }}>
      <OrdersDispatchContext.Provider value={{ setOrders }}>
        {children}
      </OrdersDispatchContext.Provider>
    </OrderStateContext.Provider>
  );
};

export default OrdersContextProvider;

export const useOrdersContext = () => {
  const ordersState = useContext(OrderStateContext);
  const ordersDispatch = useContext(OrdersDispatchContext);

  if (ordersState === undefined || ordersDispatch === undefined)
    throw new Error(
      "UseOrdersContext must be used within OrdersContextProvider."
    );

  return { ordersState, ordersDispatch };
};
