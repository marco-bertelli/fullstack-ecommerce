import {firebase} from '../firebase/config';

export type AuthUser = firebase.User;

export type SignupData={
    username: string;
    email: string;
    password: string;
}

export type UserInfo ={
    id: string;
    username: string;
    email: string;
    role:Role;
    createdAt: firebase.firestore.Timestamp;
    shippingAddress: Address[]
    stripeCustomerId:string
    updatedAt?: firebase.firestore.Timestamp
}

export type Provider = 'facebook' | 'google'

export type Role = 'SUPER_ADMIN' |'ADMIN'| 'CLIENT'

export type Address = {
    index?:number
    fullname:string
    address1:string
    address2:string
    city:string
    zipCode:string
    phone:string
}