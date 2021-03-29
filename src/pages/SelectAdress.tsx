import React from "react";
import AddAndEditAddress from "../components/select-adress/AddAndEditAddress";
import ShippingAddress from "../components/select-adress/ShippingAddress";
import { useAuthContext } from "../state/auth-context";

interface Props {}

const SelectAdress: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();
  console.log(userInfo)

  return (
    <div className="page--select-address">
      <h2 className="header">Seleziona indirizzo spedizione</h2>

      <div className="select-address">
          <div className="select-address__existing">
            {userInfo?.shippingAddress?.length &&
              userInfo.shippingAddress.map((address,index) =>
              <ShippingAddress key={index} address={address} />)}
          </div>
        

        <div className="select-address__add-new">
          <h3 className="header">Aggiungi indirizzo</h3>

          <AddAndEditAddress userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default SelectAdress;
