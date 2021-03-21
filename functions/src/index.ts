import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const env = functions.config();

type ProductCategory = "Clothing" | "Shoes" | "Watches" | "Accessories";

type Counts = {
  [key in "All" | ProductCategory]: number;
};

type Product = {
  title: string;
  description: string;
  imageUrl: string;
  imageRef: string;
  imageFileName: string;
  price: number;
  category: ProductCategory;
  inventory: number;
  creator: string;
};

export const onSignup = functions.https.onCall(async (data, context) => {
  // prendo il nome utente
  const {username} = data as { username: string };
  // controllo che ci sia l'utente
  if (!context.auth?.uid) return;

  // creo il ruolo dell'utente
  await admin.auth().setCustomUserClaims(context.auth.uid, {
    role:
      context.auth.token.email === env.admin.super_admin ?
      "SUPER_ADMIN" :
      "CLIENT",
  });

  const userRole =
    context.auth.token.email === env.admin.super_admin ?
    "SUPER_ADMIN" :
    "CLIENT";

  // aggiungo l'utente anche a un db oltre che ad un autenticazione
  // e gli setto il ruolo prendendo una env per capire se è admin o meno
  const result = await admin
      .firestore()
      .collection("users")
      .doc(context.auth?.uid)
      .set({
        username,
        email: context.auth.token.email,
        // tslint:disable-next-line:max-line-length
        role:
          context.auth.token.email === env.admin.super_admin ?
          "SUPER_ADMIN" :
          "CLIENT",
        createdAT: admin.firestore.FieldValue.serverTimestamp(),
      });

  if (!result) return;

  return {userRole};
});

export const onProductCreated = functions.firestore
    .document("products/{productId}")
    .onCreate(async (snapshot, context) => {
      const product = snapshot.data() as Product;

      let counts: Counts;

      // Query the product-count collection
      const countsData = await admin
          .firestore()
          .collection("product-counts")
          .doc("counts")
          .get();

      if (!countsData.exists) {
        // first product item
        // Construct the counts object
        counts = {
          All: 1,
          Clothing: product.category === "Clothing" ? 1 : 0,
          Shoes: product.category === "Shoes" ? 1 : 0,
          Watches: product.category === "Watches" ? 1 : 0,
          Accessories: product.category === "Accessories" ? 1 : 0,

        };
      } else {
        const {All, Clothing, Shoes, Watches, Accessories} =
        countsData.data() as Counts;

        counts = {
          All: All + 1,
          Clothing: product.category === "Clothing" ? Clothing + 1 : Clothing,
          Shoes: product.category === "Shoes" ? Shoes + 1 : Shoes,
          Watches: product.category === "Watches" ? Watches + 1 : Watches,
          Accessories: product.category === "Accessories" ? Accessories + 1 :
          Accessories,

        };
      }

      // update the collection

      return admin.firestore().collection("product-counts")
          .doc("counts").set(counts);
    });
