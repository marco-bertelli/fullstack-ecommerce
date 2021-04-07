import { firebase, storageRef } from "../firebase/config";
import { useState } from "react";
import { createImageRef, productsRef } from "../firebase";
import { AddProductData, Product, UploadProduct } from "../types";
import { useAsyncCall } from "./Index";

export const useManageProduct = () => {
  const { loading, setLoading, error, setError } = useAsyncCall();
  const [uploadProgression, setUploadProgression] = useState(0);
  const [addProductFinished, setProductFinished] = useState(false);
  const [editProductFinished, setEditProductFinished] = useState(false);

  const uploadImageToStorage = (
    image: File,
    cb: (imageUrl: string, imagePath: string) => void
  ) => {
    setLoading(true);
    //upload di un immagine verso firebase e ottenere l'url
    const imageRef = createImageRef(image.name);

    const uploadTask = imageRef.put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //calcolare il progresso di upload
        const progression =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setUploadProgression(progression);
      },
      (error) => {
        //error case
        setError(error.message);
        setLoading(false);
      },
      () => {
        //upload finito
        // setUploadProgression(0)

        //get url
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((imageUrl) => {
            cb(imageUrl, imageRef.fullPath);
          })
          .catch((err) => {
            const { message } = err as { message: string };

            setError(message);
            setLoading(false);
          });
      }
    );
  };

  const addNewProduct = (data: AddProductData, creator: string) => (
    imageUrl: string,
    imagePath: string
  ) => {
    const {
      title,
      description,
      price,
      imageFileName,
      category,
      inventory,
      path
    } = data;

    setLoading(true);
    setProductFinished(false);

    //creare un doc nella collezione prodotti con i dati e l'url immagine

    const newProduct: UploadProduct = {
      title,
      description,
      price: +price,
      category,
      inventory: +inventory,
      imageUrl,
      imageFileName: imageFileName,
      imageRef: imagePath,
      creator,
      path,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    productsRef
      .add(newProduct)
      .then(() => {
        setProductFinished(true);
        setLoading(false);
      })
      .catch((err) => {
        const { message } = err as { message: string };

        setError(message);
        setLoading(false);
      });
  };

  const editProduct = (
    productId: string,
    data: AddProductData,
    creator: string
  ) => (imageUrl: string, imagePath: string) => {
    const {
      title,
      description,
      price,
      imageFileName,
      category,
      path,
      inventory,
    } = data;

    setLoading(true);
    setEditProductFinished(false);

    //UPDATE di un prod tramite id

    const editedProduct: UploadProduct = {
      title,
      description,
      price: +price,
      category,
      inventory: +inventory,
      imageUrl,
      imageFileName: imageFileName,
      imageRef: imagePath,
      path,
      creator,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    productsRef
      .doc(productId)
      .set(editedProduct, { merge: true })
      .then(() => {
        setEditProductFinished(true);
        setLoading(false);
      })
      .catch((err) => {
        const { message } = err as { message: string };

        setError(message);
        setLoading(false);
      });
  };

  const deleteProduct = async (product: Product) => {
    try {
      setLoading(true);

      // eliminare l'immagine dallo storage
      const imageRef = storageRef.child(product.imageRef);
      await imageRef.delete();

      // eliminare il prod da firestore
      await productsRef.doc(product.id).delete();
      // TODO eliminare l'elemento dal carello se è in esso

      setLoading(false);
      return true;
    } catch (err) {
      const { message } = err as { message: string };

      setError(message);
      setLoading(false);

      return false;
    }
  };
  return {
    addNewProduct,
    uploadImageToStorage,
    editProduct,
    deleteProduct,
    editProductFinished,
    uploadProgression,
    addProductFinished,
    loading,
    error,
    setUploadProgression,
  };
};
