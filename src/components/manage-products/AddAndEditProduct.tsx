import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { categories } from "../../helpers";
import { useManageProduct } from "../../hooks/useManageProduct";
import { useAuthContext } from "../../state/auth-context";
import { AddProductData, Product } from "../../types";
import Button from "../Button";
import Input from "../Input";

const fileType = ["image/png", "image/jpeg", "image/jpg"];

interface Props {
  setOpenProductForm: (open: boolean) => void;
  productToEdit: Product | null;
}

const AddAndEditProduct: React.FC<Props> = ({setOpenProductForm,productToEdit}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    authState: { authUser },
  } = useAuthContext();
  const {
    uploadImageToStorage,
    addNewProduct,
    addProductFinished,
    uploadProgression,
    loading,
    error,
    setUploadProgression,
  } = useManageProduct();

  const { register, handleSubmit, errors, reset } = useForm<AddProductData>();
  // aggiunta prod
  const handleAddProduct = handleSubmit((data) => {
    if (!selectedFile || !authUser) return;

    return uploadImageToStorage(
      selectedFile,
      addNewProduct(data, authUser?.uid)
    );
  });

  // modifica prod 
  const handleEditProduct = handleSubmit((data)=>{
    console.log(data)
  })

  const inputRef = useRef<HTMLInputElement>(null);
  //selezione file
  const handleOpenUpload = () => {
    if (inputRef?.current) inputRef.current.click();
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || !files[0]) return;

    const file = files[0];

    if (!fileType.includes(file.type)) {
      alert('Wrong file format, only "png" or "jpeg" or "jpg');
      return;
    }

    setSelectedFile(file);
  };

  //chiudo la form alla fine del caricamento

  useEffect(() => {
    if (addProductFinished) {
      reset();
      setSelectedFile(null);
      setUploadProgression(0);
    }
  }, [addProductFinished, reset, setUploadProgression, setSelectedFile]);

  return (
    <>
      <div className="backdrop" onClick={() => setOpenProductForm(false)}>
        {"  "}
      </div>
      <div className="modal modal--add-product">
        <div className="modal-close" onClick={() => setOpenProductForm(false)}>
          &times;
        </div>

        <h2 className="header--center">{productToEdit ? 'Modifica prodotto' : 'Aggiungi prodotto'}</h2>

        <form className="form" onSubmit={productToEdit ? handleEditProduct : handleAddProduct}>
          <Input
            label="Title"
            name="title"
            placeholder="nome del prodotto"
            defaultValue={productToEdit ? productToEdit.title : ""}
            ref={register({
              required: "Titolo obbligatorio",
              minLength: {
                value: 3,
                message: "lunghezza minima del titolo 3 caratteri",
              },
            })}
            error={errors.title?.message}
          />

          <Input
            label="Description"
            name="description"
            placeholder="descrizione"
            defaultValue={productToEdit ? productToEdit.description : ""}
            ref={register({
              required: "Descrizione obbligatorio",
              minLength: {
                value: 6,
                message: "lunghezza minima della descrizione 6 caratteri",
              },
              maxLength: {
                value: 200,
                message: "lunghezza massima della descrizione 200 caratteri",
              },
            })}
            error={errors.description?.message}
          />

          <Input
            label="Price"
            type="number"
            name="price"
            placeholder="prezzo"
            defaultValue={productToEdit ? productToEdit.price : ""}
            ref={register({
              required: "Prezzo obbligatorio",
              min: {
                value: 1,
                message: "prezzo minimo 1 euro",
              },
            })}
            error={errors.price?.message}
          />

          {/* immagine */}
          <div className="form__input-container">
            <label htmlFor="Image" className="form__input">
              Image
            </label>
            <div className="form__imput-file-upload">
              {uploadProgression ? (
                <div style={{ width: "70%" }}>
                  <input
                    type="text"
                    className="upload-progression"
                    style={{
                      width: `${uploadProgression}%`,
                      color: "white",
                      textAlign: "center",
                    }}
                    value={`${uploadProgression}%`}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  onClick={handleOpenUpload}
                  readOnly
                  value={selectedFile ? selectedFile.name : productToEdit ? productToEdit.imageFileName : ""}
                  className="input"
                  name="imageFileName"
                  style={{ width: "70%", cursor: "pointer" }}
        
                  ref={register({
                    required: "Immagine Prodotto obbligatoria",
                  })}
                />
              )}

              <Button
                width="30%"
                height="100%"
                type="button"
                className="input"
                style={{ borderRadius: "0", border: "1px solid black" }}
                onClick={handleOpenUpload}
              >
                <span className="paragraph--small">Seleziona Immagine</span>
              </Button>
              <input
                onChange={handleSelectFile}
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
              />
            </div>
            {errors?.imageFileName && !selectedFile && (
              <p className="paragraph paragraph--error-small">
                {errors.imageFileName.message}
              </p>
            )}
          </div>
          {/* categoria */}
          <div className="form__input-container">
            <label htmlFor="Category" className="form__input">
              Category
            </label>

            <select
              name="category"
              className="input"
              defaultValue={productToEdit ? productToEdit.category :undefined}
              ref={register({
                required: "Categotia Prodotto obbligatoria",
              })}
            >
              <option style={{ display: "none" }}></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors?.category && (
              <p className="paragraph paragraph--error-small">
                {errors.category.message}
              </p>
            )}
          </div>

          <Input
            label="Pezzi"
            type="number"
            name="inventory"
            defaultValue={productToEdit ? productToEdit.inventory : ''}
            placeholder="Inventario del prodotto"
            ref={register({
              required: "Pezzi obbligatorio",
              min: {
                value: 1,
                message: "pezzi minimi 1 ",
              },
              pattern: {
                value: /^[0-9]\d*$/,
                message: "solo numeri positivi",
              },
            })}
            error={errors.inventory?.message}
          />

          <Button
            type="submit"
            className="btn--orange"
            width="100%"
            style={{ marginTop: "1rem" }}
            loading={loading}
            disabled={loading}
          >
            Invia
          </Button>
        </form>
        {error && <p className="paragraph paragraph--error">{error}</p>}
      </div>
    </>
  );
};

export default AddAndEditProduct;
