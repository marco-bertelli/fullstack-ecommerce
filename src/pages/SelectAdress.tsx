import React, { useState } from "react";
import AlertDialog from "../components/dialogs/AlertDialog";
import AddAndEditAddress from "../components/select-adress/AddAndEditAddress";
import ShippingAddress from "../components/select-adress/ShippingAddress";
import { useDialog } from "../hooks/useDialog";
import { useManageShippingAddress } from "../hooks/useManageShippingAddress";
import { useAuthContext } from "../state/auth-context";
import { Address } from "../types";

interface Props {}

const SelectAdress: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();

  const [addressToEdit, setAddressToEdit] = useState<Address | null>();
  const { openDialog, setOpenDialog } = useDialog();
  const [addressItemToDelete, setAddressItemToDelete] = useState<Address | null>(
    null
  );

  const {deleteAddress,loading, error } = useManageShippingAddress()

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
                setAddressToDelete={setAddressItemToDelete}
                setOpenDialog={setOpenDialog}
              />
            ))}
        </div>

        <div className="select-address__add-new">
          <h3 className="header">Aggiungi indirizzo</h3>

          <AddAndEditAddress userInfo={userInfo} addressToEdit={addressToEdit} setAddressToEdit={setAddressToEdit} />
        </div>
      </div>
      {openDialog && addressItemToDelete && (
        <AlertDialog
          header="Conferma"
          message={`sei sicuro di voler eliminare il ${addressItemToDelete.index} dagli indirizzi?`}
          onCancel={() =>{
            setAddressItemToDelete(null)
            setOpenDialog(false)
          }}

          onConfirm={async() => {
            if(addressItemToDelete.index !== undefined && userInfo){
              const finish = await deleteAddress(addressItemToDelete.index, userInfo)
              if(finish){
                setAddressItemToDelete(null)
                setOpenDialog(false)
              }
            }
            else console.log(userInfo)
          }}

          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default SelectAdress;
