import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { products, Product } from "../data/products";
import PageNotFound from "./PageNotFound";

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  //come le route di angular solo più semplici
  const params = useParams() as { productId: string };
  //utilizzo degli hooks per lo state del componente
  const [product, setProduct] = useState<Product | undefined>();
  //quando params arriva in ingresso trova il singolo
  useEffect(() => {
    const prod = products.find((item) => item.id === params.productId);

    if (prod) setProduct(prod);
    else setProduct(undefined);
  }, [params]);

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
              €{product.price.toFixed(2)}
            </span>
          </p>
        </div>
        <div className="product-detail__sub-section product-detail__sub-section--stock">
          <p className="paragraph">
            Disponibilità: <span className="paragraph--success">Disponibile</span>
          </p>
        </div>
        <div className="product-detail__sub-section quantity-control">
          <div className="qty-action">
               <FontAwesomeIcon icon={['fas','minus']} size='xs' color='grey' />
          </div>
          <div className="qty-action qty-action--qty">
            <p className="paragraph">1</p>
          </div>
          <div className="qty-action">
               <FontAwesomeIcon icon={['fas','plus']} size='xs' color='grey' />
          </div>
        </div>

        <Button>Aggiungi al Carrello</Button>
      </div>
    </div>
  );
};

export default ProductDetail;
