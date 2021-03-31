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
      <div className="payment"></div>

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
                <Button width='100%' className='btn--orange btn--payment'>Completa Pagamento</Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
