import { ProductCategory, Role } from "../types";

export const isAdmin = (role:Role | null) => role ==='ADMIN' || role ==='SUPER_ADMIN'
export const isClient = (role:Role | null) => role ==='CLIENT'

export const categories: ProductCategory[] =['Clothing', 'Shoes', 'Watches', 'Accessories']