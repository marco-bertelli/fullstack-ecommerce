import { firebase } from "../firebase/config";

export type AuthUser = firebase.User;

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type UserInfo = {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: firebase.firestore.Timestamp;
  shippingAddress: Address[];
  stripeCustomerId: string;
  updatedAt?: firebase.firestore.Timestamp;
};

export type Provider = "facebook" | "google";

export type Role = "SUPER_ADMIN" | "ADMIN" | "CLIENT";

export type Address = {
  index?: number;
  fullname: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  phone: string;
};

export type ProductTab = "All" | ProductCategory;

export type ProductCategory = "Clothing" | "Shoes" | "Watches" | "Accessories";

export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageRef: string;
  imageFileName: string;
  price: number;
  category: ProductCategory;
  inventory: number;
  creator: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
};

//product type to upload a document in firestore
export type UploadProduct = Omit<Product, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

export type AddProductData = Pick<
  Product,
  "title" | "description" | "price" | "imageFileName" | "category" | "inventory"
>;

export type CartItem = {
  id: string;
  product: string;
  quantity: number;
  user: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
};

export type UploadCartItem = Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: firebase.firestore.FieldValue
  updatedAt?: firebase.firestore.FieldValue
}
