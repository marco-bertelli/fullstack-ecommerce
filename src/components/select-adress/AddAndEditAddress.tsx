import React from "react";
import { useForm } from "react-hook-form";
import { useManageShippingAddress } from "../../hooks/useManageShippingAddress";
import { Address, UserInfo } from "../../types";
import Button from "../Button";
import Input from "../Input";

interface Props {
  userInfo: UserInfo | null;
  addressToEdit: Address | null | undefined;
  setAddressToEdit: (address: Address | null) => void;
}

const AddAndEditAddress: React.FC<Props> = ({
  userInfo,
  addressToEdit,
  setAddressToEdit,
}) => {
  const { register, errors, handleSubmit, reset } = useForm<
    Omit<Address, "index">
  >();
  const {
    addNewAddress,
    editAddress,
    loading,
    error,
  } = useManageShippingAddress();

  const handleAddNewAddress = handleSubmit(async (data) => {
    if (!userInfo) return;

    const finished = await addNewAddress(data, userInfo);

    if (finished) reset();
  });

  const handleEditAddress = handleSubmit(async (data) => {
    if (!userInfo?.shippingAddress || addressToEdit?.index === undefined)
      return;

    if (typeof addressToEdit.index !== "number") return;

    //se non ci sono cambiamenti
    const {
      fullname,
      address1,
      address2,
      city,
      phone,
      zipCode,
    } = addressToEdit;

    if (
      fullname === data.fullname &&
      address1 === data.address1 &&
      address2 === data.address2 &&
      city === data.city &&
      phone === data.phone &&
      zipCode === data.zipCode
    ) {
      alert("Nessun cambiamento ");
      return;
    }
    const finished = await editAddress(data, addressToEdit.index, userInfo);

    if (finished) {
      reset();
      setAddressToEdit(null);
    }
  });

  return (
    <form
      className="form"
      onSubmit={addressToEdit ? handleEditAddress : handleAddNewAddress}
      style={{ width: "100%" }}
    >
      <p
        className="paragraph paragraph--success paragraph--focus"
        style={{ cursor: "pointer", textAlign: "end", marginRight: "0.5rem" }}
        onClick={() =>{
          reset()
          setAddressToEdit(null)
        }}
      >
        Clear all
      </p>
      <Input
        label="Fullname"
        name="fullname"
        placeholder="Nome"
        defaultValue={addressToEdit ? addressToEdit?.fullname : ""}
        ref={register({
          required: "Nome richiesto",
        })}
        error={errors.fullname?.message}
      />
      <Input
        label="Address1"
        name="address1"
        placeholder="indirizzo 1"
        defaultValue={addressToEdit ? addressToEdit?.address1 : ""}
        ref={register({
          required: "Indirizzo richiesto",
        })}
        error={errors.address1?.message}
      />
      <Input
        label="Address2"
        name="address2"
        placeholder="Indirizzo 2"
        defaultValue={addressToEdit ? addressToEdit?.address2 : ""}
        ref={register}
      />
      <Input
        label="City"
        name="city"
        placeholder="Città"
        defaultValue={addressToEdit ? addressToEdit?.city : ""}
        ref={register({
          required: "Città richiesta",
        })}
        error={errors.city?.message}
      />
      <Input
        label="Zipcode"
        name="zipCode"
        placeholder="Codice Postale"
        defaultValue={addressToEdit ? addressToEdit?.zipCode : ""}
        ref={register({
          required: "Codice postale richiesto",
        })}
        error={errors.zipCode?.message}
      />
      <Input
        label="Phone"
        name="phone"
        placeholder="Phone"
        defaultValue={addressToEdit ? addressToEdit?.phone : ""}
        ref={register({
          required: "Telefono richiesto",
        })}
        error={errors.phone?.message}
      />

      <Button loading={loading} disabled={loading} type="submit" width="100%">
        Salva
      </Button>

      {error && <p className="paragraph paragraph--error">{error}</p>}
    </form>
  );
};

export default AddAndEditAddress;
