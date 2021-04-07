import { CreatePaymentMethodCardData, PaymentMethod } from "@stripe/stripe-js";
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
  shippingAddress?: Address[];
  stripeCustomerId?: string;
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
  item: Product;
  createdAt: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
};

export type UploadCartItem = Omit<
  CartItem,
  "id" | "item" | "createdAt" | "updatedAt"
> & {
  createdAt: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

export type CreatePaymentIntentData = {
  amount: number;
  customer?: string;
  paymentMethod?: string;
};

export type CreatePaymentMethod =
  | string
  | Pick<CreatePaymentMethodCardData, "card"
  | "billing_details" | "metadata" | "payment_method" >

export type UserCards = {data: PaymentMethod[]}

export type StripeCustomer = {id: string; invoice_settings: {default_payment_method: string}}