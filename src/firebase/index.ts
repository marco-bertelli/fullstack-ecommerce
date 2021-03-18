import { UserInfo } from '../types'
import {db,firebase} from './config'

export const usersRef = db.collection('users')

export const snapshotToUserInfo = (doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) =>{
    if(!doc.exists){ return null} 
        
    const docData = doc.data() as Omit<UserInfo,'id'>
    const userInfo : UserInfo = {
      id: doc.id,
      ...docData
    }
    return userInfo
}