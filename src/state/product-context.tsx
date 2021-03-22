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

interface Props {}

type Products = { [key in ProductTab]: Product[] };
type ProductCounts = { [key in ProductTab]: number };

type ProductState = {
  products: Products
  productCounts:ProductCounts
  loading:boolean
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

const initialProductCounts: ProductCounts= {
    All: 0,
    Clothing: 0,
    Shoes: 0,
    Watches: 0,
    Accessories: 0,
  };

const ProductsContextProvider: React.FC<Props> = ({ children }) => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [products, setProducts] = useState(initialProducts);
  const [productCounts,setProductCounts] = useState(initialProductCounts)

  //effect per ottenere i prodotti da firestore !
  useEffect(() => {
    setLoading(true);
    const unsubscribe = productsRef.onSnapshot({
      next: (snapshots) => {
        const allProducts: Product[] = [];
        snapshots.forEach((snapshot) => {
          const product = snapshotToDoc<Product>(snapshot);

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
        setLoading(false)
    },
      error: (err) => {
        setError(err.message)
        setLoading(false)
      }
    });

    return () => unsubscribe();
  }, []);

  // prendere dati per la paginazione
  useEffect(() =>{
    const unsubscribe = productCountsRef.doc('counts').onSnapshot((snapshot)=>{
        const countsData=snapshot.data() as ProductCounts

        setProductCounts(countsData)
    })
    return () => unsubscribe();
  },[])

  return (
    <ProductStateContext.Provider value={{ products,productCounts,loading,error }}>
      <ProductDispatchContext.Provider value={{ setProducts }}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductStateContext.Provider>
  );
};

export default ProductsContextProvider;

export const useProductContext = () => {
  const productsState = useContext(ProductStateContext)
  const productsDispatch = useContext(ProductDispatchContext)

  if(productsState === undefined || productsDispatch === undefined) throw new Error
  ('useProductContext must be used within ProductsContextProvider')
  
  return {productsState, productsDispatch}
}
