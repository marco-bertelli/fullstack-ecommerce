import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { orderCountsRef} from "../firebase";
import { isAdmin} from "../helpers";
import { useAuthContext } from "./auth-context";

interface Props {}

type OrdersCountsState = {
  orderCounts: number;
};

type OrdersCountsDispatch = {
  setOrderCounts: Dispatch<SetStateAction<number>>;
};

const OrderCountsStateContext = createContext<OrdersCountsState | undefined>(
  undefined
);
const OrdersCountsDispatchContext = createContext<
  OrdersCountsDispatch | undefined
>(undefined);

const OrdersCountsContextProvider: React.FC<Props> = ({ children }) => {
  const [orderCounts, setOrderCounts] = useState(0);
  const {
    authState: { userInfo },
  } = useAuthContext();

  useEffect(() => {
    if (!userInfo || !isAdmin(userInfo.role)) return setOrderCounts(0);

    const unsubscribe = orderCountsRef.doc("counts").onSnapshot(snapshot => {
        
      const counts = snapshot.data() as { orderCounts: number };
      console.log(counts)
      setOrderCounts(counts.orderCounts);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrderCountsStateContext.Provider value={{ orderCounts }}>
      <OrdersCountsDispatchContext.Provider value={{ setOrderCounts }}>
        {children}
      </OrdersCountsDispatchContext.Provider>
    </OrderCountsStateContext.Provider>
  );
};

export default OrdersCountsContextProvider;

export const useOrdersCountsContext = () => {
  const ordersCountsState = useContext(OrderCountsStateContext);
  const ordersCountsDispatch = useContext(OrdersCountsDispatchContext);

  if (ordersCountsState === undefined || ordersCountsDispatch === undefined)
    throw new Error(
      "UseOrdersContext must be used within OrdersContextProvider."
    );

  return { ordersCountsState, ordersCountsDispatch };
};
