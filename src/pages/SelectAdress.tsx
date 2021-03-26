import React from "react";
import AddAndEditAddress from "../components/select-adress/AddAndEditAddress";
import { useAuthContext } from "../state/auth-context";

interface Props {}

const SelectAdress: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();

  return (
    <div className="page--select-address">
      <h2 className="header">Seleziona indirizzo spedizione</h2>

      <div className="select-address">
        {userInfo?.shippingAddress?.length && (
          <div className="select-address__existing">
             <div>Indirizzi salvati qua</div>     
          </div>
        )}

        <div className="select-address__add-new">
          <h3 className="header">Aggiungi indirizzo</h3>

          <AddAndEditAddress userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default SelectAdress;
