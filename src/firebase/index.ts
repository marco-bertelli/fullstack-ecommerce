import { UserInfo } from '../types'
import {db,firebase, storageRef} from './config'
import {v4 as uuidv4} from 'uuid'

export const usersRef = db.collection('users')
export const productsRef = db.collection('products')

export const snapshotToUserInfo = (doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) =>{
    if(!doc.exists){ return null} 
        
    const docData = doc.data() as Omit<UserInfo,'id'>
    const userInfo : UserInfo = {
      id: doc.id,
      ...docData
    }
    return userInfo
}

export const productImagesFolder = 'products'

export const createImageRef = (imageName:string) =>{
  const uuid= uuidv4();
  return storageRef.child(`${productImagesFolder}/${imageName}-${uuid}`)
}