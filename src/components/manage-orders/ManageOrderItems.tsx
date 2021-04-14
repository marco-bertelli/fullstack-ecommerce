import React from "react";
import { Link } from "react-router-dom";
import {
  calculateCartQuantity,
  formatAmount,
  calculateCartAmount,
} from "../../helpers";
import { Order } from "../../types";
import Button from "../Button";

interface Props {
  order: Order;
}

const ManageOrderItems: React.FC<Props> = ({
  order: {
    id,
    createdAt,
    items,
    shipmentStatus,
    user: { name },
  },
}) => {
  return (
    <Link to={`/admin/manage-orders/${id}`}>
      <div className="orders-content orders-content--content">
        <div className="orders-column">
          <p className="paragrapg--center paragraph--focus">
            {createdAt.toDate().toDateString()}
          </p>
        </div>
        <div className="orders-column orders-colum--hide">
          <p className="paragrapg--center paragraph--focus">
            {calculateCartQuantity(items)}
          </p>
        </div>
        <div className="orders-column">
          <p className="paragrapg--center paragraph--focus">
            {formatAmount(calculateCartAmount(items))} €
          </p>
        </div>
        <div className="orders-column">
          <p
            className="paragrapg--center paragraph--focus"
            style={{
              color:
                shipmentStatus === "New"
                  ? "blue"
                  : shipmentStatus === "Preparing"
                  ? "chocolate"
                  : shipmentStatus === "Shipped"
                  ? "green"
                  : shipmentStatus === "Delivered"
                  ? "grey"
                  : shipmentStatus === "Canceled"
                  ? "red"
                  : undefined,
            }}
          >
            {shipmentStatus ? shipmentStatus : ""}
          </p>
        </div>
        <div className="orders-column orders-colum--hide">
          <p className="paragrapg--center paragraph--focus">{name}</p>
        </div>
        <div className="orders-column orders-colum--manage">
          <p className="paragrapg--center paragraph--focus">
            {shipmentStatus === "Delivered" ? (
              "Done"
            ) : (
              <Button
                width="60%"
                className="btn--orange manage-orders-btn--mobile"
              >
                Gestisci ordine
              </Button>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ManageOrderItems;
