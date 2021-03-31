import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "../components/Button";
import { calculateCartAmount, calculateCartQuantity } from "../helpers";
import { useCartContext } from "../state/CartContext";
import { Address } from "../types";

interface Props {}

const Checkout: React.FC<Props> = () => {
  const [orderSummary, setOrderSummary] = useState<{
    quantity: number;
    amount: number;
  }>();
  const { location } = useHistory<{ address: Address }>();
  const { state } = location;
  const { cart } = useCartContext();

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
      });
  }, [cart]);

  if (!state?.address) return <Redirect to="/buy/select-address" />;

  const { fullname, address1, address2, city, zipCode, phone } = state.address;

  return (
    <div className="page--checkout">
      <div className="payment">
        <h2 className="header">Seleziona un metodo di pagamento</h2>

        <form className="form">
          <div className="form--new-card">
            <label htmlFor="newCard" className="card card--new">
              <input
                type="radio"
                name="card"
                value="new-card"
                style={{ width: "10%" }}
              />

              <h4
                className="paragraph paragraph--bold"
                style={{ width: "30%" }}
              >
                Usa una nuova carta
              </h4>
              <p className="paragraph" style={{ width: "5%" }}></p>

              <div className="new-card__logo" style={{ width: "45%" }}>
                <FontAwesomeIcon
                  icon={["fab", "cc-visa"]}
                  size="1x"
                  style={{ margin: "0 0.5rem" }}
                  color="#206CAB"
                />
                <FontAwesomeIcon
                  icon={["fab", "cc-mastercard"]}
                  size="1x"
                  style={{ margin: "0 0.5rem" }}
                  color="red"
                />
                <FontAwesomeIcon
                  icon={["fab", "cc-amex"]}
                  size="1x"
                  style={{ margin: "0 0.5rem" }}
                  color="light-blue"
                />
              </div>
              <p className="paragraph" style={{ width: "10%" }}></p>
            </label>

            <div className="new-card__form">
              <div className="form__input-container form__input-container--card">
                <input
                  type="text"
                  className="input input--card-name"
                  name="cardName"
                  placeholder="nome titolare "
                />
              </div>
              <div className="form__input-container form__input-container--card">
                <CardElement
                  options={{
                    style: {
                      base: { color: "blue", iconColor: "blue" },
                      invalid: { color: "red", iconColor: "red" },
                    },
                  }}
                />
              </div>

              <div className="form__set-new-card">
                <div className="form__input-container">
                  <input type="checkbox" name="save" />
                  <label htmlFor="saveCard" className="paragraph">
                    Salva questa carta
                  </label>
                </div>
              </div>

              <div className="form__set-new-card">
                <div className="form__input-container">
                  <input type="checkbox" name="setDefault" />
                  <label htmlFor="setDefault" className="paragraph">
                    Imposta come predefinita
                  </label>
                </div>
              </div>
              
            </div>
          </div>
        </form>
      </div>

      <div className="summary">
        {/* indirizzi spedizione */}
        <div className="summary__section">
          <h3 className="header">Indirizzo Spedizione</h3>
          <p className="paragraph paragraph--focus">{fullname}</p>
          <p className="paragraph paragraph--focus">{address1}</p>
          {address2 && <p className="paragraph paragraph--focus">{address2}</p>}
          <p className="paragraph paragraph--focus">
            {city}, {zipCode}
          </p>
          <p className="paragraph paragraph--focus">Tel: {phone}</p>
        </div>

        {/* sommario ordine */}
        <div className="summary__section">
          <h3 className="header">Sommario Ordine</h3>

          <div className="order-summary">
            <div>
              <p className="paragraph paragraph--focus">Totale quantità:</p>
              <p className="paragraph paragraph--focus">Totale:</p>
            </div>
            <div>
              <p className="paragraph paragraph--focus">
                {orderSummary && orderSummary.quantity}
              </p>
              <p className="paragraph paragraph--focus">
                €{orderSummary && orderSummary.amount}
              </p>
            </div>
          </div>
        </div>
        <div className="summary__section">
          <Button width="100%" className="btn--orange btn--payment">
            Completa Pagamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
