import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import AlertDialog from "../components/dialogs/AlertDialog";
import AddAndEditProduct from "../components/manage-products/AddAndEditProduct";
import AdminProductItem from "../components/manage-products/AdminProductItem";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useDialog } from "../hooks/useDialog";
import { useManageProduct } from "../hooks/useManageProduct";
import { usePagination } from "../hooks/usePagination";
import { useProductContext } from "../state/product-context";
import { useSearchContext } from "../state/search-context";
import { Product } from "../types";

const prodPerPage = 10;

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false);
  const {
    productsState: { products, loading, error, productCounts, queryMoreProducts },
  } = useProductContext();
  const { searchedItems } = useSearchContext();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { openDialog, setOpenDialog } = useDialog();
  const {
    deleteProduct,
    loading: deleteProdLoading,
    error: deleteProdError,
  } = useManageProduct();
  const { page, totalPages } = usePagination(
    productCounts.All,
    prodPerPage,
    undefined,
    searchedItems as Product[]
  );

  const [productByPage, setProductByPage] = useState(products.All);
  const [paginatedSearchItems, setPaginatedSearchItems] = useState(
    searchedItems
  );
  // effect paginazione
  useEffect(() => {
    const startIndex = prodPerPage * (page - 1);
    const endIndex = prodPerPage * page;

    if (searchedItems) {
      setPaginatedSearchItems(searchedItems.slice(startIndex, endIndex));
      setProductByPage([]);
    } else {
      // controllo se devo recuperare altri prod

      if (
        products.All.length < productCounts.All &&
        products.All.length < prodPerPage * page
      ) {
        queryMoreProducts()
        return
      }

      setProductByPage(products.All.slice(startIndex, endIndex));
      setPaginatedSearchItems(null)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[products.All, productCounts.All, page, searchedItems]);
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

      {totalPages > 0 && (
        <div className="pagination-container">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
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
              {paginatedSearchItems ? (
                <>
                  {paginatedSearchItems.length < 1 ? (
                    <tr>
                      <td colSpan={6}>
                        <h2 className="header--center">Nessun Prodotto</h2>
                      </td>
                    </tr>
                  ) : (
                    (paginatedSearchItems as Product[]).map((product) => (
                      <AdminProductItem
                        product={product}
                        key={product.id}
                        setOpenProductForm={setOpenProductForm}
                        setProductToEdit={setProductToEdit}
                        setOpenDialog={setOpenDialog}
                        setProductToDelete={setProductToDelete}
                      />
                    ))
                  )}
                </>
              ) : (
               productByPage && productByPage.map((product) => (
                  <AdminProductItem
                    product={product}
                    key={product.id}
                    setOpenProductForm={setOpenProductForm}
                    setProductToEdit={setProductToEdit}
                    setOpenDialog={setOpenDialog}
                    setProductToDelete={setProductToDelete}
                  />
                ))
              )}
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
