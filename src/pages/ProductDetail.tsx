import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PageNotFound from "./PageNotFound";
import { useProductContext } from "../state/product-context";
import { Product } from "../types";
import Spinner from "../components/Spinner";
import { formatAmount, isAdmin, isClient } from "../helpers";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const {productsState: { products, loading },} = useProductContext();
  //come le route di angular solo più semplici
  const params = useParams() as { productId: string };
  //utilizzo degli hooks per lo state del componente
  const [product, setProduct] = useState<Product | undefined>();
  const {authState:{authUser, userRole}} = useAuthContext()
  const {setModalType} = useModalContext()
  
  
  //quando params arriva in ingresso trova il singolo
  useEffect(() => {
    const prod = products.All.find((item) => item.id === params.productId);

    if (prod) setProduct(prod);
    else setProduct(undefined);
  }, [params, products.All]);

  //spinner per Loading
  if (loading) return <Spinner color="grey" width={50} height={50} />;

  // in caso page-not-found
  if (!product) return <PageNotFound />;
  return (
    <div className="page--product-detail">
      <div className="product-detail__section">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-detail__section">
        <div className="product-detail__sub-section">
          <h3 className="header">{product.title}</h3>
          <p className="paragraph">{product.description}</p>
        </div>
        <div className="product-detail__sub-section">
          <p className="paragraph">
            Prezzo :{" "}
            <span className="paragraph--orange">
              €{formatAmount(product.price)}
            </span>
          </p>
        </div>
        <div className="product-detail__sub-section product-detail__sub-section--stock">
          <p className="paragraph">
            Disponibilità:{" "}
            <span
              className={`paragraph--success ${
                product.inventory === 0 ? "paragraph--error" : "undefined"
              }`}
            >
              {product.inventory === 0
                ? "Non disponibile"
                : `Disponibile (${product.inventory}) pz`}
            </span>
          </p>
        </div>
        <div className="product-detail__sub-section quantity-control">
          <div className="qty-action">
            <FontAwesomeIcon icon={["fas", "minus"]} size="xs" color="grey" />
          </div>
          <div className="qty-action qty-action--qty">
            <p className="paragraph">1</p>
          </div>
          <div className="qty-action">
            <FontAwesomeIcon icon={["fas", "plus"]} size="xs" color="grey" />
          </div>
        </div>

        <Button disabled={product.inventory === 0}
          onClick={()=>{
            if (!authUser){
              setModalType('signin')
              return
            } else if (authUser && isAdmin(userRole)){
              alert('Sei un admin non puoi aggiungere al carrello')
              return
            } else if (authUser && isClient(userRole)){
              //funzione per aggiungere al carrello
            }
          }}
        >Aggiungi al Carrello</Button>
      </div>
    </div>
  );
};

export default ProductDetail;
