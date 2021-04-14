import React, { useRef } from "react";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import Button from "../components/Button";
import ShippmentStatusControl from "../components/manage-orders/ShippmentStatusControl";
import Spinner from "../components/Spinner";
import { formatAmount } from "../helpers";
import { useQueryOrder } from "../hooks/useQuearyOrders";
import PageNotFound from "./PageNotFound";

interface Props {}

const ManageOrderDetail: React.FC<Props> = () => {
  const params = useParams<{ id: string }>()
  const { order, loading, error } = useQueryOrder(params.id)

  const labelRef = useRef<HTMLDivElement>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const printShippingLabel = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: `Shipping label - ${params.id}`,
  })

  const printInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice - ${params.id}`,
  })

  if (loading) return <Spinner color='grey' height={50} width={50} />

  if (error) return <h2 className='header--center'>{error}</h2>

  if (!order) return <PageNotFound />

  const {
    id,
    amount,
    items,
    shippingAddress: { fullname, address1, address2, city, zipCode, phone },
    paymentStatus,
    shipmentStatus,
    createdAt,
  } = order

  return (
    <div className='page--order-details'>
      <h2 className='header'>Dettaglio Ordine</h2>

      <div className='order-printing'>
        {shipmentStatus === 'New' ? (
          <>
            {/* Shipping label */}
            <div className='order-printing__section'>
              <Button
                width='100%'
                className='btn--orange'
                onClick={printShippingLabel}
              >
                Stampa etichetta spedizione
              </Button>

              <div className='print-component'>
                <div className='page shipping-label' ref={labelRef}>
                  <div className='label'>
                    <h4 className='header'>Recipient: {fullname}</h4>
                    <p className='paragraph'>{address1},</p>
                    {address2 && <p className='paragraph'>{address2}</p>}
                    <p className='paragraph'>
                      {city}, {zipCode}
                    </p>
                    <p className='paragraph'>Tel: {phone}</p>

                    <p className='paragraph'>
                      Order number:{' '}
                      <span className='paragraph--focus'>{id}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className='order-printing__section'>
              <Button
                width='100%'
                className='btn--orange'
                onClick={printInvoice}
              >
                Stampa Fattura 
              </Button>

              <div className='print-component'>
                <div className='page invoice' ref={invoiceRef}>
                  <h1 className='header--center'>MarcoShop</h1>

                  <div className='invoice__head'>
                    <h3 className='header'>Seller:</h3>
                    <h4 className='header'>Marco-Shop</h4>
                    <p className='paragraph'>2214 Willison Street</p>
                    <p className='paragraph'>Big Lake</p>
                    <p className='paragraph'>Minnesota 73128</p>
                    <p className='paragraph'>Tel: 3454423311</p>
                  </div>

                  <div className='invoice__head'>
                    <h3 className='header'>Buyer:</h3>
                    <h4 className='header'>{fullname}</h4>
                    <p className='paragraph'>{address1}</p>
                    {address2 && <p className='paragraph'>{address2}</p>}
                    <p className='paragraph'>
                      {city} {zipCode}
                    </p>
                    <p className='paragraph'>Tel: {phone}</p>
                  </div>

                  <div className='invoice__head'>
                    <p className='paragraph'>
                      Invoice no: <span className='paragraph--focus'>{id}</span>
                    </p>
                    <p className='paragraph'>
                      Invoice date:{' '}
                      <span className='paragraph--focus'>
                        {createdAt.toDate().toDateString()}
                      </span>
                    </p>
                  </div>

                  <table className='table invoice__items'>
                    <thead className='invoice__header-row'>
                      <tr>
                        <th className='table-cell'>Item</th>
                        <th className='table-cell' style={{ width: '40%' }}>
                          Description
                        </th>
                        <th className='table-cell'>Qty</th>
                        <th className='table-cell'>Price</th>
                        <th className='table-cell'>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map(
                        ({ quantity, item: { title, price } }, i) => (
                          <tr key={i}>
                            <td className='table-cell paragraph--center'>
                              {i + 1}
                            </td>
                            <td className='table-cell paragraph--center'>
                              {title}
                            </td>
                            <td className='table-cell paragraph--center'>
                              {quantity}
                            </td>
                            <td className='table-cell paragraph--center'>
                              {formatAmount(price)}
                            </td>
                            <td className='table-cell paragraph--center'>
                              {formatAmount(quantity * price)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <h3 className='header'>
                    Total amount: ${formatAmount(amount)}
                  </h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h3
            className='header paragraph--focus'
            style={{
              color:
                shipmentStatus === 'Preparing'
                  ? 'chocolate'
                  : shipmentStatus === 'Shipped'
                  ? 'green'
                  : shipmentStatus === 'Delivered'
                  ? 'grey'
                  : shipmentStatus === 'Canceled'
                  ? 'red'
                  : undefined,
            }}
          >
            {shipmentStatus}
          </h3>
        )}
      </div>

      <div className='order-section'>
        <h4 className='header'>ID Ordine:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>{id}</p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Oggetti comprati:</h4>
        {items.map(({ quantity, item: { id, title, price } }, i) => (
          <div key={id} className='order-section__content'>
            <div className='order-item'>
              <p className='paragraph paragraph--focus' style={{ width: '5%' }}>
                {i + 1}
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '50%' }}
              >
                {title}
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '15%' }}
              >
                {quantity} x {formatAmount(price)}
              </p>
              <p className='paragraph paragraph--focus' style={{ width: '5%' }}>
                =
              </p>
              <p
                className='paragraph paragraph--focus'
                style={{ width: '20%' }}
              >
                €{formatAmount(quantity * price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='order-section'>
        <h4 className='header'>Totale Oridne:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>€{formatAmount(amount)}</p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Indirizzo:</h4>
        <div className='order-section__content'>
          <div className='order-address'>
            <p className='paragraph'>
              Recipient name:{' '}
              <span className='paragraph--focus'>{fullname}</span>
            </p>
            <p className='paragraph paragraph--focus'>
              {address1}, {address2 ? address2 : ''}, {city}, {zipCode}, Tel:{' '}
              {phone}
            </p>
          </div>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Stato Pagamento:</h4>
        <div className='order-section__content'>
          <p className='paragraph paragraph--focus'>{paymentStatus || 'n/a'}</p>
        </div>
      </div>

      <div className='order-section'>
        <h4 className='header'>Stato spedizione:</h4>
        <div className='order-section__content'>
          <ShippmentStatusControl order={order} />
        </div>
      </div>
    </div>
  )
};

export default ManageOrderDetail;
