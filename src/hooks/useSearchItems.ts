import firebase from "firebase";
import { ordersIndex, productsIndex } from "../algolia";
import { useOrdersContext } from "../state/orders-context";

import { useProductContext } from "../state/product-context";
import { SearchOrder, SearchProduct } from "../types";
import { useAsyncCall } from "./useAsyncCall";

export const useSearchItems = (pathname: String) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const {
    productsDispatch: { setSearchedProducts },
  } = useProductContext();

  const {ordersDispatch:{setSearchedOrders}} = useOrdersContext()

  const searchItems = async (searchString: string) => {
    try {
      setLoading(true);

      if (
        pathname === "/" ||
        pathname === "/products" ||
        pathname === "/admin/manage-products"
      ) {
        const result = await productsIndex.search<SearchProduct>(searchString);

        const products = result.hits.map((item) => {
          const createdAt = firebase.firestore.Timestamp.fromDate(
            new Date(item.createdAt._seconds * 1000)
          );

          const updatedAt = item.updatedAt
            ? firebase.firestore.Timestamp.fromDate(
                new Date(item.updatedAt._seconds * 1000)
              )
            : undefined;

          return { ...item, id: item.objectID, createdAt, updatedAt };
        });

        setSearchedProducts(products);

        setLoading(false);

        return true;
      } else if (pathname==='/admin/manage-orders'){

        const result = await ordersIndex.search<SearchOrder>(searchString);

        const orders = result.hits.map((item) => {
          const createdAt = firebase.firestore.Timestamp.fromDate(
            new Date(item.createdAt._seconds * 1000)
          );

          const updatedAt = item.updatedAt
            ? firebase.firestore.Timestamp.fromDate(
                new Date(item.updatedAt._seconds * 1000)
              )
            : undefined;

          return { ...item, id: item.objectID, createdAt, updatedAt };
        });

        setSearchedOrders(orders);

        setLoading(false);

        return true;

      }
    } catch (error) {
      const { message } = error as { message: string };
      setError(message);
      setLoading(false);

      return false;
    }
  };
  return { loading, error, searchItems };
};
