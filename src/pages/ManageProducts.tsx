import React, { useState } from "react";
import Button from "../components/Button";
import AddAndEditProduct from "../components/manage-products/AddAndEditProduct";
import AdminProductItem from "../components/manage-products/AdminProductItem";
import Spinner from "../components/Spinner";
import { useProductContext } from "../state/product-context";
import { Product } from "../types";

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false);
  const {
    productsState: { products, loading },
  } = useProductContext();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  if (loading) return <Spinner color="grey" width={50} height={50} />;

  return (
    <div className="page--manage-products">
      <div className="manage-products__section">
        <Button
          className="btn--orange"
          width="12rem"
          onClick={() => setOpenProductForm(true)}
        >
          Aggiungi prodotto
        </Button>

        {openProductForm && (
          <AddAndEditProduct
            setProductToEdit={setProductToEdit}
            productToEdit={productToEdit}
            setOpenProductForm={setOpenProductForm}
          />
        )}
      </div>
      <div className="manage-products__section">
        {!loading && products.All.length === 0 ? (
          <h2 className="header--center">Nessun Prodotto, inseriscili</h2>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="table-cell">Title</th>
                <th className="table-cell">Image</th>
                <th className="table-cell">Price (€)</th>
                <th className="table-cell table-cell--hide">Created At</th>
                <th className="table-cell table-cell--hide">Updated At</th>
                <th className="table-cell">Pezzi</th>
              </tr>
            </thead>

            <tbody>
              {products.All.map((product) => (
                <AdminProductItem
                  product={product}
                  key={product.id}
                  setOpenProductForm={setOpenProductForm}
                  setProductToEdit={setProductToEdit}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
