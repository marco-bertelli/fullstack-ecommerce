import {firebase} from "../firebase/config"
import { useState } from "react"
import { createImageRef, productsRef } from "../firebase"
import { AddProductData, UploadProduct } from "../types"
import { useAsyncCall } from "./Index"

export const useManageProduct = () =>{

    const {loading,setLoading,error,setError} = useAsyncCall()
    const [uploadProgression,setUploadProgression] = useState(0);
    const [addProductFinished,setProductFinished] = useState(false)

    const uploadImageToStorage = (image:File,cb: (imageUrl:string,imagePath:string)=>void) =>{
        setLoading(true)
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
                cb(imageUrl, imageRef.fullPath)
            }).catch(err =>{
                const {message} = err as {message:string}

                setError(message)
                setLoading(false)
            })
        })

    }
    
    const addNewProduct = (data:AddProductData,creator:string)=> (imageUrl:string,imagePath:string) => {
        const {title,description,price,imageFileName,category,inventory} = data
        
        setLoading(true)
        setProductFinished(false)
        
        //creare un doc nella collezione prodotti con i dati e l'url immagine

        const newProduct: UploadProduct = {
            title,
            description,
            price : +price,
            category,
            inventory:+inventory,
            imageUrl,
            imageFileName :imageFileName,
            imageRef:imagePath,
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
    }
    return {addNewProduct,uploadImageToStorage,uploadProgression,addProductFinished,loading,error,setUploadProgression}
}