import {firebase} from "../firebase/config"
import { useState } from "react"
import { createImageRef, productsRef } from "../firebase"
import { AddProductData, Product, UploadProduct } from "../types"
import { useAsyncCall } from "./Index"

export const useAddProduct = () =>{

    const {loading,setLoading,error,setError} = useAsyncCall()
    const [uploadProgression,setUploadProgression] = useState(0);
    const [addProductFinished,setProductFinished] = useState(false)

    const addNewProduct = (image:File,data:AddProductData,creator:string) => {
        const {title,description,price,category,inventory} = data
        
        setLoading(true)
        setProductFinished(false)
        
        //upload di un immagine verso firebase e ottenere l'url
        const imageRef=createImageRef(image.name)

        const uploadTask = imageRef.put(image)

        uploadTask.on('state_changed',(snapshot)=>{
            //calcolare il progresso di upload
            const progression = (snapshot.bytesTransferred / snapshot.totalBytes) *100

            setUploadProgression(progression)

        },(error)=>{
            //error case
            setError(error.message)
            setLoading(false)
        },()=>{
            //upload finito
            // setUploadProgression(0)

            //get url
            uploadTask.snapshot.ref.getDownloadURL().then((imageUrl)=>{
                 //creare un doc nella collezione prodotti con i dati e l'url immagine

                const newProduct: UploadProduct = {
                    title,
                    description,
                    price : +price,
                    category,
                    inventory:+inventory,
                    imageUrl,
                    imageFileName :image.name,
                    imageRef:imageRef.fullPath,
                    creator,
                    createdAt:firebase.firestore.FieldValue.serverTimestamp()
                }
                productsRef.add(newProduct).then(()=>{
                    setProductFinished(true)
                    setLoading(false)
                }).catch(err=>{
                    const {message} = err as {message:string}

                    setError(message)
                    setLoading(false)
                })
            }).catch(err =>{
                const {message} = err as {message:string}

                setError(message)
                setLoading(false)
            })
        })
    }
    return {addNewProduct,uploadProgression,addProductFinished,loading,error,setUploadProgression}
}