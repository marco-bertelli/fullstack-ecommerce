import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PageNotFound from "./PageNotFound";
import { useProductContext } from "../state/product-context";
import { Product } from "../types";
import Spinner from "../components/Spinner";
import { formatAmount, isAdmin, isClient } from "../helpers";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
import { useManageCart } from "../hooks/useManageCart";
import { useDialog } from "../hooks/useDialog";
import ConfirmAddToCartDialog from "../components/dialogs/ConfirmAddToCartDialog";
import { useCartContext } from "../state/CartContext";

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const {
    productsState: { products, loading, error },
  } = useProductContext();
  //come le route di angular solo più semplici
  const params = useParams() as { productId: string };
  //utilizzo degli hooks per lo state del componente
  const [product, setProduct] = useState<Product | undefined>();
  const {
    authState: { authUser, userRole },
  } = useAuthContext();
  const { setModalType } = useModalContext();
  const [quantity, setQuantity] = useState(1);
  const {
    addToCart,
    loading: addToCartLoading,
    error: addToCartError,
  } = useManageCart();
  const { openDialog, setOpenDialog } = useDialog();
  const [addedCartItem, setAddedcartItem] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const history = useHistory();
  const { cart } = useCartContext();

  //quando params arriva in ingresso trova il singolo
  useEffect(() => {
    console.log("/products" + params.productId);
    const prod = products.All.find(
      (item) => item.path === "/products/" + params.productId
    );

    if (prod) setProduct(prod);
    else setProduct(undefined);
  }, [params, products.All]);

  //spinner per Loading
  if (loading) return <Spinner color="grey" width={50} height={50} />;

  if (!loading && error) return <h2 className="header">{error}</h2>;

  // in caso page-not-found
  if (!product) return <PageNotFound />;
  return (
    <div>
    <div className="single-item">
      <div className="left-set">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="right-set">
        <div className="subname">{product.title}</div>

        <div className="description">
          <p>{product.description}</p>
        </div>
        
        <div className="price">
          Prezzo :{" "}
          <span className="paragraph--orange">
            €{formatAmount(product.price)}
          </span>
        </div>
        <div className="product-detail__sub-section product-detail__sub-section--stock">
          <p className="paragraph">
            Disponibilità:{" "}
            <span
              className={`paragraph--success ${
                product.inventory === 0 ? "paragraph--error" : "undefined"
              }`}
            >
              {product.inventory} pz
            </span>
          </p>
        </div>

        {product.inventory === 0 ? (
          <p className="paragraph--error">Esaurito</p>
        ) : (
          <div className="product-detail__sub-section quantity-control">
            <div
              className="qty-action"
              style={{ cursor: quantity === 1 ? "not-allowed" : undefined }}
              onClick={() =>
                setQuantity((prev) => {
                  if (prev < 2) return prev;

                  return prev - 1;
                })
              }
            >
              <FontAwesomeIcon icon={["fas", "minus"]} size="xs" color="grey" />
            </div>
            <div className="qty-action qty-action--qty">
              <p className="paragraph">{quantity}</p>
            </div>
            <div
              className="qty-action"
              style={{
                cursor:
                  quantity === product.inventory ? "not-allowed" : undefined,
              }}
              onClick={() =>
                setQuantity((prev) => {
                  if (prev === product.inventory) return prev;

                  return prev + 1;
                })
              }
            >
              <FontAwesomeIcon icon={["fas", "plus"]} size="xs" color="grey" />
            </div>
          </div>
        )}

        <Button
          disabled={product.inventory === 0 || addToCartLoading}
          loading={addToCartLoading}
          onClick={async () => {
            if (!authUser) {
              setModalType("signin");
              return;
            } else if (authUser && isAdmin(userRole)) {
              alert("Sei un admin non puoi aggiungere al carrello");
              return;
            } else if (authUser && isClient(userRole)) {
              //controllo sulla quantità
              // Check if this item is already in the existing cart, and if it is, check it's cart quantity vs it's inventory

              const foundItem = cart
                ? cart.find((item) => item.product === product.id)
                : undefined;

              if (
                foundItem &&
                foundItem.quantity + quantity > product.inventory
              ) {
                const allowedQty = product.inventory - foundItem.quantity;
                setQuantity(allowedQty === 0 ? 1 : allowedQty);
                alert(
                  `hai già "${foundItem.quantity} pcs" di questo prodotto nel carrello, perciò ne puoi aggiungere massimo "${allowedQty} pcs".`
                );
                return;
              }

              //funzione per aggiungere al carrello
              const finished = await addToCart(
                product.id,
                quantity,
                authUser.uid,
                product.inventory
              );

              if (finished) {
                setOpenDialog(true);
                setAddedcartItem({ product, quantity });
                setQuantity(1);
              }
            }
          }}
        >
          Aggiungi al Carrello
        </Button>

        {addToCartError && <p className="paragraph--error">{addToCartError}</p>}
      </div>

      
    </div>
    {openDialog && addedCartItem && (
        <ConfirmAddToCartDialog
          header="Aggiunto al carrello"
          cartItemData={addedCartItem}
          goToCart={() => {
            setOpenDialog(false);
            history.push("/buy/my-cart");
          }}
          continueShopping={() => {
            setOpenDialog(false);
            history.push("/");
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;
