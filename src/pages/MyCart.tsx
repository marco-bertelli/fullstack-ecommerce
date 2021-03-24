import React from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import MyCartItem from "../components/cart/MyCartItem";
import Spinner from "../components/Spinner";
import {
  calculateCartAmount,
  calculateCartQuantity,
  formatAmount,
} from "../helpers";
import { useCartContext } from "../state/CartContext";

interface Props {}

const MyCart: React.FC<Props> = () => {
  const { cart } = useCartContext();
  const history = useHistory();

  if (!cart) return <Spinner color="grey" height={25} width={25} />;

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
            <MyCartItem key={item.id} cartItem={item} />
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
          onClick={() => history.push("/buy/select-adress")}
        >
          Vai al Checkout
        </Button>
      </div>
    </div>
  );
};

export default MyCart;
