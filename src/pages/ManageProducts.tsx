import React, { useState } from "react";
import Button from "../components/Button";
import AlertDialog from "../components/dialogs/AlertDialog";
import AddAndEditProduct from "../components/manage-products/AddAndEditProduct";
import AdminProductItem from "../components/manage-products/AdminProductItem";
import Spinner from "../components/Spinner";
import { useDialog } from "../hooks/useDialog";
import { useManageProduct } from "../hooks/useManageProduct";
import { useProductContext } from "../state/product-context";
import { Product } from "../types";

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false);
  const {
    productsState: { products, loading, error },
  } = useProductContext();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { openDialog, setOpenDialog } = useDialog();
  const {
    deleteProduct,
    loading: deleteProdLoading,
    error: deleteProdError,
  } = useManageProduct();

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
                  setOpenDialog={setOpenDialog}
                  setProductToDelete={setProductToDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {error && <p className="paragraph paragraph--error">{error}</p>}

      {openDialog && (
        <AlertDialog
          header="Please confirm"
          message={`sei sicuro di voler eliminare ${
            productToDelete ? productToDelete?.title : "item"
          } ?`}
          onCancel={() => {
            setProductToDelete(null);
            setOpenDialog(false);
          }}
          onConfirm={async () => {
            if (productToDelete) {
              const finished = await deleteProduct(productToDelete);
              if (finished) setOpenDialog(false);
            }
          }}
          loading={deleteProdLoading}
          error={deleteProdError}
        />
      )}
    </div>
  );
};

export default ManageProducts;
