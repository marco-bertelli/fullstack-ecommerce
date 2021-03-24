import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { formatAmount } from "../../helpers";
import { CartItem } from "../../types";

interface Props {
  cartItem: CartItem;
}

const MyCartItem: React.FC<Props> = ({ cartItem }) => {
  const {
    quantity,
    item: { title, description, price, imageUrl },
  } = cartItem;
  return (
    <div className="cart-item">
      <img src={imageUrl} alt={title} className="cart-item__img" />

      <div className="cart-item__detail">
        <h4 className="header">{title}</h4>

        <p className="paragraph paragraph--focus">{description}</p>
        <p className="paragraph">
          Prezzo :€{" "}
          <span className="paragraph--orange paragraph--focus">
            {formatAmount(price)}
          </span>
        </p>

        <div className="cart-item__update-qty">
          <div className="quantity-control">
            <div className="qty-action">
              <FontAwesomeIcon icon={["fas", "minus"]} size="xs" color="red" />
            </div>
            <div className="qty-action">{quantity}</div>
            <div className="qty-action">
              <FontAwesomeIcon
                icon={["fas", "plus"]}
                size="xs"
                color="#282c34"
              />
            </div>
          </div>

          <div className="quantity-update-action">
            <p
              className="paragraph paragraph--success paragraph--focus"
              style={{ cursor: "pointer" }}
            >
              Conferma
            </p>

            <p
              className="paragraph paragraph--error paragraph--focus"
              style={{ cursor: "pointer" }}
            >
              Cancella
            </p>
          </div>
        </div>

        <p
          className="paragraph paragraph--error paragraph--focus"
          style={{ cursor: "pointer" }}
        >
          Rimuovi
        </p>
      </div>

      <div className="cart-item__amount">
          <h4 className="header">Prezzo</h4>
          <p className="paragraph paragraph--focus paragraph-bold">
            €{formatAmount(quantity * price)}
          </p>
      </div>
    </div>
  );
};

export default MyCartItem;
