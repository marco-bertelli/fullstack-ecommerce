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
import { firebase } from "../firebase/config";

interface Props {}

const ordersQueryLimit = 20;

type OrdersState = {
  orders: Order[] | null;
  loading: boolean;
  error: string;
  queryMoreOrders: () => void
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
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const { loading, setLoading, error, setError } = useAsyncCall();
  const {
    authState: { userInfo },
  } = useAuthContext();
  const [
    lastDocument,
    setLastDocument,
  ] = useState<firebase.firestore.DocumentData>();

  // recupero ulteriori ordini
  const queryMoreOrders = async () => {
    try {
      if (!lastDocument) return;

      setLoading(true);
      const snapshots = await ordersRef
        .orderBy("createdAt", "desc")
        .startAfter(lastDocument)
        .limit(ordersQueryLimit)
        .get();

      const newOrders = snapshots.docs.map((snapshot) =>
        snapshotToDoc<Order>(snapshot)
      );

      const lastVisible = snapshots.docs[snapshots.docs.length - 1];
      setLastDocument(lastVisible);

      // combino ordini con i nuovi
      setOrders((prev)=>prev ? [...prev,...newOrders]:newOrders);
      setLoading(false);
    } catch (error) {
      const {message} = error as {message:string}
      setError(message)
      setLoading(false)

      return false
    }
  };

  // recupero ordini
  useEffect(() => {
    if (!userInfo) return setOrders(null);

    setLoading(true);
    let unsubscribe: () => void;

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
        .limit(ordersQueryLimit)
        .onSnapshot({
          next: (snapshots) => {
            const orders = snapshots.docs.map((snapshot) =>
              snapshotToDoc<Order>(snapshot)
            );

            const lastVisible = snapshots.docs[snapshots.docs.length - 1];
            setLastDocument(lastVisible);

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

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <OrderStateContext.Provider value={{ orders, loading, error, queryMoreOrders }}>
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
