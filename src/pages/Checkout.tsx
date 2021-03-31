import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { isGetAccessorDeclaration } from "typescript";
import { Address } from "../types";

interface Props {}

const Checkout: React.FC<Props> = () => {
  const { location } = useHistory<{address: Address}>();
  const { state } = location;

  if(!state?.address) return <Redirect to='/buy/select-address' />

  const {fullname, address1, address2, city, zipCode, phone} = state.address

  return <div></div>;
};

export default Checkout;
