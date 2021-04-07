import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import Button from "../components/Button";
import AlertDialog from "../components/dialogs/AlertDialog";
import { address_key } from "../components/select-adress/ShippingAddress";
import Spinner from "../components/Spinner";
import { calculateCartAmount, calculateCartQuantity } from "../helpers";
import { useCheckout } from "../hooks/useCheckout";
import { useDialog } from "../hooks/useDialog";
import { useFetchCards } from "../hooks/useFetchCards";
import { useAuthContext } from "../state/auth-context";
import { useCartContext } from "../state/CartContext";
import {
  Address,
  CartItem,
  CreatePaymentIntentData,
  CreatePaymentMethod,
  UploadOrder,
} from "../types";

interface Props {}

const Checkout: React.FC<Props> = () => {
  const [orderSummary, setOrderSummary] = useState<{
    quantity: number;
    amount: number;
    orderItems: CartItem[];
  }>();
  const [useCard, setUseCard] = useState<
    { type: "new" } | { type: "saved"; payment_method: string }
  >({ type: "new" });
  const [disabled, setDisabled] = useState(true);
  const [NewCardError, setNewCardError] = useState("");
  const [address, setAddress] = useState<Address | null>(null);
  const [loadAddress, setLoadAddress] = useState(true);
  const [openSetDefault, setOpenSetDefault] = useState(false);

  const { cart } = useCartContext();
  const history = useHistory();
  const {
    authState: { userInfo },
  } = useAuthContext();
  const {
    completePayment,
    createStripeCustomerId,
    loading,
    error,
  } = useCheckout();
  const {
    userCards,
    stripeCustomer,
    loading: fetchCardsLoading,
    error: fetchCardsError,
  } = useFetchCards(userInfo);

  const { openDialog, setOpenDialog } = useDialog();

  const elements = useElements();
  const stripe = useStripe();

  const btnRef = useRef<HTMLButtonElement>(null);

  const { register, errors, handleSubmit, reset } = useForm<{
    cardName: string;
    save?: boolean;
    setDefault?: boolean;
  }>();

  useEffect(() => {
    if (cart && cart.length > 0)
      setOrderSummary({
        quantity: calculateCartQuantity(cart),
        amount: calculateCartAmount(cart),
        orderItems: cart,
      });
  }, [cart]);

  useEffect(() => {
    if (userCards?.data && userCards.data.length > 0) {
      setUseCard({
        type: "saved",
        payment_method:
          stripeCustomer?.invoice_settings.default_payment_method ||
          userCards.data[0].id,
      });
      setDisabled(false);
      reset();
    }
  }, [userCards?.data, stripeCustomer, reset]);

  useEffect(() => {
    const addressData = window.localStorage.getItem(address_key);
    if (!addressData) {
      setLoadAddress(false);
      return;
    }

    const address = JSON.parse(addressData);
    setAddress(address);
    setLoadAddress(false);
  }, [setAddress, setLoadAddress]);

  const handleClickBtn = () => {
    if (btnRef && btnRef.current) btnRef.current.click();
  };

  const handleCompletePayment = handleSubmit(async (data) => {
    if (!elements || !orderSummary || !stripe || !userInfo || !address) return;

    const { amount, quantity, orderItems } = orderSummary;
    const newOrder: UploadOrder = {
      items: orderItems.map(({ quantity, user, item }) => ({
        quantity,
        user,
        item,
      })),
      amount,
      totalQuantity: quantity,
      shippingAddress: address,
      user: { id: userInfo.id, name: userInfo.username },
    };

    if (useCard.type === "new") {
      // New card
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      if (typeof data.save === "boolean") {
        // new card -to save
        //get a client secre con la cloud functions
        const createPaymentIntentData: CreatePaymentIntentData = {
          amount: orderSummary.amount,
        };
        //preparo metodo pagamento
        const payment_method: CreatePaymentMethod = {
          card: cardElement,
          billing_details: { name: data.cardName },
        };
        if (data.save) {
          //new card not save
          if (!userInfo.stripeCustomerId) {
            //utente non ha stripe id
            const stripeCustomerId = await createStripeCustomerId();
            createPaymentIntentData.customer = stripeCustomerId;
          } else {
            //utente ha stripe id la salvo li
            createPaymentIntentData.customer = userInfo.stripeCustomerId;
          }
        }

        const finished = await completePayment(
          { createPaymentIntentData, stripe, payment_method },
          {
            save: data.save,
            setDefault: data.setDefault,
            customerId: createPaymentIntentData.customer,
          },
          newOrder,
          orderItems
        );

        if (finished) {
          setOpenDialog(true)
          reset();
        }
      }
    } else if (useCard.type === "saved" && useCard.payment_method) {
      //carta esistente

      //get a client secre con la cloud functions
      const createPaymentIntentData: CreatePaymentIntentData = {
        amount: orderSummary.amount,
        customer: stripeCustomer?.id,
        paymentMethod: useCard.payment_method,
      };
      //preparo metodo pagamento
      const payment_method: CreatePaymentMethod = useCard.payment_method;

      const finished = await completePayment(
        { createPaymentIntentData, stripe, payment_method },
        {
          save: data.save,
          setDefault: data.setDefault,
          customerId: stripeCustomer?.id,
        },
        newOrder,
        orderItems
      );

      if (finished) {
        setOpenDialog(true)
        reset();
      }
    }
  });

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    setDisabled(e.empty || !e.complete);
    setNewCardError(e.error ? e.error.message : "");

    if (e.complete) setNewCardError("");
  };

  if (loadAddress) return <Spinner color="grey" width={50} height={50} />;
  if (!address) return <Redirect to="/buy/select-address" />;

  const { fullname, address1, address2, city, zipCode, phone } = address;

  return (
    <div className="page--checkout">
      <div className="payment">
        <h2 className="header">Seleziona un metodo di pagamento</h2>

        {fetchCardsLoading ? (
          <Spinner color="grey" width={30} height={30} />
        ) : (
          <form className="form" onSubmit={handleCompletePayment}>
            {userCards?.data &&
              userCards.data.length > 0 &&
              userCards.data.map((method) => (
                <label key={method.id} className="card" htmlFor={method.id}>
                  <input
                    type="radio"
                    name="card"
                    value={method.id}
                    style={{ width: "10%" }}
                    defaultChecked={
                      useCard.type === "saved" &&
                      useCard.payment_method === method.id
                    }
                    onClick={() => {
                      setUseCard({ type: "saved", payment_method: method.id });
                      setDisabled(false);
                      reset();
                    }}
                  />

                  <p className="paragraph" style={{ width: "40%" }}>
                    **** **** **** {method.card?.last4}
                  </p>

                  <p
                    className="paragraph--center paragraph--focus"
                    style={{ width: "10%" }}
                  >
                    {method.card?.brand === "visa" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-visa"]}
                        size="2x"
                        color="#206CAB"
                      />
                    ) : method.card?.brand === "mastercard" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-mastercard"]}
                        size="2x"
                        color="red"
                      />
                    ) : method.card?.brand === "amex" ? (
                      <FontAwesomeIcon
                        icon={["fab", "cc-amex"]}
                        size="2x"
                        color="light-blue"
                      />
                    ) : (
                      method.card?.brand
                    )}
                  </p>

                  <div style={{ width: "30%" }}>
                    {method.id ===
                    stripeCustomer?.invoice_settings.default_payment_method ? (
                      <p className="paragraph--center paragraph--focus">
                        Default
                      </p>
                    ) : useCard.type === "saved" &&
                      useCard.payment_method === method.id ? (
                      <div>
                        <input
                          type="checkbox"
                          name="setDefault"
                          ref={register}
                        />
                        <label
                          htmlFor="setDefault"
                          className="set-default-card"
                        >
                          Imposta Come predefinita
                        </label>
                      </div>
                    ) : undefined}
                  </div>

                  <p className="paragraph" style={{ width: "10%" }}>
                    <FontAwesomeIcon
                      icon={["fas", "trash"]}
                      size="1x"
                      color="red"
                    />
                  </p>
                </label>
              ))}

            <div className="form--new-card">
              <label htmlFor="newCard" className="card card--new">
                <input
                  type="radio"
                  name="card"
                  value="new-card"
                  defaultChecked={useCard.type === "new"}
                  style={{ width: "10%" }}
                  onClick={() => {
                    setUseCard({ type: "new" });
                    setDisabled(true);
                    reset();
                  }}
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
              {useCard.type === "new" && (
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
                    {NewCardError && (
                      <p className="paragarph paragraph--error">
                        {NewCardError}
                      </p>
                    )}
                  </div>

                  <div className="form__set-new-card">
                    <div className="form__input-container">
                      <input
                        type="checkbox"
                        name="save"
                        ref={register}
                        onClick={() => setOpenSetDefault((prev) => !prev)}
                      />
                      <label htmlFor="saveCard" className="paragraph">
                        Salva questa carta
                      </label>
                    </div>
                  </div>

                  {openSetDefault && (
                    <div className="form__set-new-card">
                      <div className="form__input-container">
                        <input
                          type="checkbox"
                          name="setDefault"
                          ref={register}
                        />
                        <label htmlFor="setDefault" className="paragraph">
                          Imposta come predefinita
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              ref={btnRef}
              style={{ display: "none" }}
              disabled={!stripe || !useCard || disabled || loading}
            ></button>
          </form>
        )}
        {error && <p className="paragraph paragraph--error">{error}</p>}

        {fetchCardsError && (
          <p className="paragraph paragraph--error">{fetchCardsError}</p>
        )}
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
            disabled={!stripe || !useCard || disabled || loading}
            className="btn--orange btn--payment"
            loading={loading}
          >
            Completa Pagamento
          </Button>
        </div>
      </div>

      {openDialog && (
        <AlertDialog
          header="Pagamento confermato"
          message="pagamento avvenuto con successo clicca ok per vedere l ordine"
          onConfirm={()=>{
            setOpenDialog(false)
            history.replace('/orders/my-orders')
          }}
          confirmText='Ok'
        />
      )}
    </div>
  );
};

export default Checkout;
