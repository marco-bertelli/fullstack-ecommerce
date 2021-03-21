import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { productsRef, snapshotToProduct } from "../firebase";
import { useAsyncCall } from "../hooks/useAsyncCall";
import { Product, ProductTab } from "../types";

interface Props {}

type Products = { [key in ProductTab]: Product[] };

type ProductState = {
  products: Products;
  loading:boolean,
  error:string
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

const ProductsContextProvider: React.FC<Props> = ({ children }) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [products, setProducts] = useState(initialProducts);

  //effect per ottenere i prodotti da firestore !
  useEffect(() => {
    const unsubscribe = productsRef.onSnapshot({
      next: (snapshots) => {
        const allProducts: Product[] = [];
        snapshots.forEach((snapshot) => {
          const product = snapshotToProduct(snapshot);

          allProducts.push(product);
        });

        const updatedProducts: any = {};

        Object.keys(initialProducts).map((cat) => {
          const category = cat as ProductTab;

          category === "All"
            ? (updatedProducts.All = allProducts)
            : (updatedProducts[category] = allProducts.filter(item => item.category === category));
        }); // ritorna l'attay con le props di initialstate
        // dopo processo di smistaggio aggiorno lo state
        setProducts(updatedProducts)
    },
      error: (err) => setError(err.message),
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProductStateContext.Provider value={{ products,loading,error }}>
      <ProductDispatchContext.Provider value={{ setProducts }}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductStateContext.Provider>
  );
};

export default ProductsContextProvider;
