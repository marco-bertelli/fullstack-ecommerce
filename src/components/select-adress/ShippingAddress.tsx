import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Address } from "../../types";
import Button from "../Button";

interface Props {
  address: Address;
  setAddressToEdit: (address: Address | null) => void;
}

const ShippingAddress: React.FC<Props> = ({ address, setAddressToEdit }) => {
  const { fullname, address1, address2, city, phone, zipCode } = address;
  return (
    <div className="shipping-address">
      <div className="shipping-address__detail">
        <h4 className="header">{fullname}</h4>
        <p className="paragraph">{address1}</p>
        {address2 && <p className="paragraph">{address2}</p>}
        <p className="paragraph">{city}</p>
        <p className="paragraph">{zipCode}</p>
        <p className="paragraph">{phone}</p>
      </div>

      <Button width="100%" className="btn--orange" style={{ margin: "1rem 0" }}>
        Spedisci a questo indirizzo
      </Button>

      <div className="shipping-address__edit">
        <FontAwesomeIcon
          icon={["fas", "edit"]}
          size="1x"
          style={{ cursor: "pointer" }}
          onClick={()=>setAddressToEdit(address)}
        />
        <FontAwesomeIcon
          icon={["fas", "trash"]}
          size="1x"
          color="red"
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
