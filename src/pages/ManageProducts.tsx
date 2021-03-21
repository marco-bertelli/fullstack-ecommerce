import React, { useState } from "react";
import Button from "../components/Button";
import AddAndEditProduct from "../components/manage-products/AddAndEditProduct";



interface Props {
 
}

const ManageProducts: React.FC<Props> = () => {

  const [openProductForm,setOpenProductForm] = useState(false)

  return (
    <div className="page--manage-products">
      <div className="manage-products__section">
        <Button 
        className="btn--orange" 
        width="12rem"
        onClick={()=>setOpenProductForm(true)}
        >
          Aggiungi prodotto
        </Button>

        {openProductForm  && <AddAndEditProduct  setOpenProductForm={setOpenProductForm} />}

      </div>
      <div className="manage-products__section"></div>
    </div>
  );
};

export default ManageProducts;
