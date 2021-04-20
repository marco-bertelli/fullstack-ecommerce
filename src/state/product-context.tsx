import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { productCountsRef, productsRef, snapshotToDoc } from "../firebase";
import { useAsyncCall } from "../hooks/useAsyncCall";
import { Product, ProductTab } from "../types";
import { firebase } from "../firebase/config";

interface Props {}

const limitQuery = 6;

type Products = { [key in ProductTab]: Product[] };
type ProductCounts = { [key in ProductTab]: number };

type ProductState = {
  products: Products;
  productCounts: ProductCounts;
  loading: boolean;
  error: string;
  queryMoreProducts: () => void
};

type ProductDispatch = {
  setProducts: Dispatch<SetStateAction<Products>>;
};

const ProductStateContext = createContext<ProductState | undefined>(undefined);
const ProductDispatchContext = createContext<ProductDispatch | undefined>(
  undefined
);

const initialProducts: Products = {
  All: [],
  Clothing: [],
  Shoes: [],
  Watches: [],
  Accessories: [],
};

const initialProductCounts: ProductCounts = {
  All: 0,
  Clothing: 0,
  Shoes: 0,
  Watches: 0,
  Accessories: 0,
};

const ProductsContextProvider: React.FC<Props> = ({ children }) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [products, setProducts] = useState(initialProducts);
  const [productCounts, setProductCounts] = useState(initialProductCounts);
  const [
    lastDocument,
    setLastDocument,
  ] = useState<firebase.firestore.DocumentData>();

  const queryMoreProducts = async () => {
    try {
      if (!lastDocument) return;

      setLoading(true);

      const snapshots = await productsRef
        .orderBy("createdAt", "desc")
        .startAfter(lastDocument)
        .limit(limitQuery)
        .get();

      const newQueries = snapshots.docs.map((snapshot) =>
        snapshotToDoc<Product>(snapshot)
      );

      const lastVisible = snapshots.docs[snapshots.docs.length - 1];
      setLastDocument(lastVisible);

      // aggiungo i nuovi prodotti ai vecchi
      setProducts((prev) => {
        const updatedProducts: any = {};

        Object.keys(initialProducts).forEach((cat) => {
          const category = cat as ProductTab;

          category === "All"
            ? (updatedProducts.All = [...prev.All, ...newQueries])
            : (updatedProducts[category] = [
                ...prev[category],
                ...newQueries.filter((item) => item.category === category),
              ]);
        }); // ritorna l'attay con le props di initialstate
        return updatedProducts
      });

      setLoading(false);
    } catch (error) {
      const {message} = error as {message:string}
      setError(message)
      setLoading(false)

      return false
    }
  };

  //effect per ottenere i prodotti da firestore !
  useEffect(() => {
    setLoading(true);
    const unsubscribe = productsRef
      .orderBy("createdAt", "desc")
      .limit(limitQuery)
      .onSnapshot({
        next: (snapshots) => {
          const allProducts = snapshots.docs.map((snapshot) =>
            snapshotToDoc<Product>(snapshot)
          );

          const lastVisible = snapshots.docs[snapshots.docs.length - 1];
          setLastDocument(lastVisible);

          const updatedProducts: any = {};

          Object.keys(initialProducts).forEach((cat) => {
            const category = cat as ProductTab;

            category === "All"
              ? (updatedProducts.All = allProducts)
              : (updatedProducts[category] = allProducts.filter(
                  (item) => item.category === category
                ));
          }); // ritorna l'attay con le props di initialstate
          // dopo processo di smistaggio aggiorno lo state
          setProducts(updatedProducts);
          setLoading(false);
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
        },
      });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // prendere dati per la paginazione
  useEffect(() => {
    const unsubscribe = productCountsRef
      .doc("counts")
      .onSnapshot((snapshot) => {
        const countsData = snapshot.data() as ProductCounts;

        setProductCounts(countsData);
      });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductStateContext.Provider
      value={{ products, productCounts, loading, error, queryMoreProducts }}
    >
      <ProductDispatchContext.Provider value={{ setProducts }}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductStateContext.Provider>
  );
};

export default ProductsContextProvider;

export const useProductContext = () => {
  const productsState = useContext(ProductStateContext);
  const productsDispatch = useContext(ProductDispatchContext);

  if (productsState === undefined || productsDispatch === undefined)
    throw new Error(
      "useProductContext must be used within ProductsContextProvider"
    );

  return { productsState, productsDispatch };
};
