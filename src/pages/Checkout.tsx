import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { calculateCartAmount, calculateCartQuantity } from "../helpers";
import { useCartContext } from "../state/CartContext";
import { Address } from "../types";

interface Props {}

const Checkout: React.FC<Props> = () => {
  const [orderSummary, setOrderSummary] = useState<{
    quantity: number;
    amount: number;
  }>();
  const [useNewCard, setUseNewCard] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [NewCardError, setNewCardError] = useState('');
  const [address, setAddress] = useState<Address | null>(null)
  const [loadAddress, setLoadAddress] = useState(true)

  const { cart } = useCartContext();
  const elements = useElements()

  const btnRef = useRef<HTMLButtonElement>(null);

  const { register, errors, handleSubmit } = useForm<{
    cardName: string;
    save?: boolean;
    setDefault?: boolean;
  }>();

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
      });
  }, [cart]);

  useEffect(() => {
    const addressData=window.localStorage.getItem('shippingAddress')
    if(!addressData) {
      setLoadAddress(false)
      return
    } 

    const address = JSON.parse(addressData)
    setAddress(address)
    setLoadAddress(false)

  },[setAddress,setLoadAddress])

  const handleClickBtn = () => {
    if (btnRef && btnRef.current) btnRef.current.click();
  };

  const handleCompletePayment = handleSubmit((data) => {
    if(!elements) return;

    const cardElement = elements.getElement(CardElement)
    console.log(data);
    console.log(cardElement);

    // New card 

    // new card -to save 

    //new card not save

    //carta esistente
  });

  const handleCardChange = (e: StripeCardElementChangeEvent) =>{
    setDisabled(e.empty || !e.complete)
    setNewCardError(e.error ? e.error.message : '')

    if(e.complete) setNewCardError('')
  }

  if(loadAddress) return <Spinner color='grey' width={50} height={50} />
  if (!address) return <Redirect to="/buy/select-address" />;

  const { fullname, address1, address2, city, zipCode, phone } = address;

  return (
    <div className="page--checkout">
      <div className="payment">
        <h2 className="header">Seleziona un metodo di pagamento</h2>

        <form className="form" onSubmit={handleCompletePayment}>
          <div className="form--new-card">
            <label htmlFor="newCard" className="card card--new">
              <input
                type="radio"
                name="card"
                value="new-card"
                style={{ width: "10%" }}
                onClick={()=>setUseNewCard(true)}
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
                  ref={register({
                    required: "titolare della carta obbligatorio",
                  })}
                />

                {errors.cardName && (
                  <p className="paragraph paragraph--small paragraph--error">
                    {errors.cardName.message}
                  </p>
                )}
              </div>
              <div className="form__input-container form__input-container--card">
                <CardElement
                  options={{
                    style: {
                      base: { color: "blue", iconColor: "blue" },
                      invalid: { color: "red", iconColor: "red" },
                    },
                  }}
                  onChange={handleCardChange}
                />
                {NewCardError && <p className='paragarph paragraph--error'>{NewCardError}</p>}
              </div>

              <div className="form__set-new-card">
                <div className="form__input-container">
                  <input type="checkbox" name="save" ref={register} />
                  <label htmlFor="saveCard" className="paragraph">
                    Salva questa carta
                  </label>
                </div>
              </div>

              <div className="form__set-new-card">
                <div className="form__input-container">
                  <input type="checkbox" name="setDefault" ref={register} />
                  <label htmlFor="setDefault" className="paragraph">
                    Imposta come predefinita
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button ref={btnRef} style={{ display: "none" }}></button>
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
          <Button
            onClick={handleClickBtn}
            width="100%"
            disabled={!useNewCard || disabled}
            className="btn--orange btn--payment"
          >
            Completa Pagamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
