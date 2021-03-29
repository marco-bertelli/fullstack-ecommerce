import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import MyCartItem from "../components/cart/MyCartItem";
import AlertDialog from "../components/dialogs/AlertDialog";
import Spinner from "../components/Spinner";
import {
  calculateCartAmount,
  calculateCartQuantity,
  formatAmount,
} from "../helpers";
import { useDialog } from "../hooks/useDialog";
import { useManageCart } from "../hooks/useManageCart";
import { useCartContext } from "../state/CartContext";
import { CartItem } from "../types";

interface Props {}

const MyCart: React.FC<Props> = () => {
  const { cart } = useCartContext();
  const history = useHistory();
  const { openDialog, setOpenDialog } = useDialog();
  const { removeCartItem, loading, error } = useManageCart();
  const [cartItemToDelete, setCartItemToDelete] = useState<CartItem | null>(
    null
  );

  if (!cart) return <Spinner color="grey" height={50} width={50} />;

  if (cart && cart.length === 0)
    return (
      <h2 className="header--center">
        Nessun Prodotto, start
        <span
          onClick={() => history.push("/")}
          className="header--orange header--link"
        >
          Shopping?
        </span>
      </h2>
    );

  return (
    <div className="page--my-cart">
      <div className="cart">
        <h2 className="header">Carrello</h2>

        <div className="cart-detail">
          {cart.map((item) => (
            <MyCartItem
              key={item.id}
              cartItem={item}
              setOpenDialog={setOpenDialog}
              setCartItemToDelete={setCartItemToDelete}
              openDialog={openDialog}
            />
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <h3 className="header">Sommario</h3>

        <div>
          <p className="paragraph">
            Quantità:{"  "}{" "}
            <span className="paragraph paragraph--orange paragraph--focus">
              {calculateCartQuantity(cart)}
            </span>
          </p>

          <p className="paragraph">
            Amount:{"  "}{" "}
            <span className="paragraph paragraph--orange paragraph--focus">
              {formatAmount(calculateCartAmount(cart))}
            </span>
          </p>
        </div>

        <Button
          width="100%"
          className="btn--orange"
          style={{ margin: "1rem 0" }}
          onClick={() => history.push("/buy/select-address")}
        >
          Vai al Checkout
        </Button>
      </div>
      {openDialog && cartItemToDelete && (
        <AlertDialog
          header="Conferma"
          message={`sei sicuro di voler eliminare ${cartItemToDelete.item.title} dal carrello?`}
          onCancel={() =>{
            setCartItemToDelete(null)
            setOpenDialog(false)
          }}

          onConfirm={async() => {
            if(cartItemToDelete){
              const finish = await removeCartItem(cartItemToDelete.item.id, cartItemToDelete.user)
              if(finish){
                setCartItemToDelete(null)
                setOpenDialog(false)
              }
            }
          }}

          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default MyCart;
