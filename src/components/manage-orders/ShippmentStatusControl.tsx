import React, { ChangeEvent, useState } from "react";
import { shipmentStatues } from "../../helpers";
import { useUpdateShipmentStatus } from "../../hooks/useUpdateShipmentStatus";
import { Order, ShipmentStatus } from "../../types";
import Button from "../Button";

interface Props {
  order: Order;
}

const ShippmentStatusControl: React.FC<Props> = ({
  order: { id, shipmentStatus },
}) => {
  const [newStatus, setNewStatus] = useState(shipmentStatus);
  const { updateStatus, loading, error } = useUpdateShipmentStatus();
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setNewStatus(e.target.value as ShipmentStatus);
  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === shipmentStatus) return;

    const finished = await updateStatus(id, newStatus);

    if (!finished && error) alert(error);
  };

  return (
    <div className="shipment-status">
      <select
        name="status"
        className="status-action"
        defaultValue={shipmentStatus}
        onChange={handleStatusChange}
      >
        {shipmentStatues.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <Button
        width="40%"
        className="btn--orange"
        onClick={handleUpdateStatus}
        loading={loading}
        disabled={loading || newStatus === shipmentStatus}
      >
        Modifica
      </Button>
    </div>
  );
};
export default ShippmentStatusControl;
