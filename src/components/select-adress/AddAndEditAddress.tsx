import React from "react";
import { useForm } from "react-hook-form";
import { Address } from "../../types";
import Button from "../Button";
import Input from "../Input";

interface Props {}

const AddAndEditAddress: React.FC<Props> = () => {
  const { register, errors, handleSubmit } = useForm<Omit<Address, "index">>();

	const handleAddNewAddress = handleSubmit((data) =>{
		console.log(data)
	})

  return (
    <form className="form" onSubmit={handleAddNewAddress}>
      <Input
        label="Fullname"
        name="fullname"
        placeholder="Nome"
        ref={register({
          required: "Nome richiesto",
        })}
        error={errors.fullname?.message}
      />
      <Input
        label="Address1"
        name="address1"
        placeholder="indirizzo 1"
        ref={register({
          required: "Indirizzo richiesto",
        })}
        error={errors.address1?.message}
      />
      <Input
        label="Address2"
        name="address2"
        placeholder="Indirizzo 2"
        ref={register}
      />
      <Input
        label="City"
        name="city"
        placeholder="Città"
        ref={register({
          required: "Città richiesta",
        })}
        error={errors.city?.message}
      />
      <Input
        label="Zipcode"
        name="zipCode"
        placeholder="Codice Postale"
        ref={register({
          required: "Codice postale richiesto",
        })}
        error={errors.zipCode?.message}
      />
      <Input
        label="Phone"
        name="phone"
        placeholder="Phone"
        ref={register({
          required: "Telefono richiesto",
        })}
        error={errors.phone?.message}
      />

			<Button type='submit' width='100%'>Salva</Button>
    </form>
  );
};

export default AddAndEditAddress;
