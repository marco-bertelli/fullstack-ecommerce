import React, { useState } from "react";
import AddAndEditAddress from "../components/select-adress/AddAndEditAddress";
import ShippingAddress from "../components/select-adress/ShippingAddress";
import { useAuthContext } from "../state/auth-context";
import { Address } from "../types";

interface Props {}

const SelectAdress: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();

  const [addressToEdit, setAddressToEdit] = useState<Address | null>();

  return (
    <div className="page--select-address">
      <h2 className="header">Seleziona indirizzo spedizione</h2>

      <div className="select-address">
        <div className="select-address__existing">
          {userInfo?.shippingAddress?.length &&
            userInfo.shippingAddress.map((address, index) => (
              <ShippingAddress
                key={index}
                address={{...address,index}}
                setAddressToEdit={setAddressToEdit}
              />
            ))}
        </div>

        <div className="select-address__add-new">
          <h3 className="header">Aggiungi indirizzo</h3>

          <AddAndEditAddress userInfo={userInfo} addressToEdit={addressToEdit} setAddressToEdit={setAddressToEdit} />
        </div>
      </div>
    </div>
  );
};

export default SelectAdress;
