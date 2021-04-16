import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import algoliasearch from "algoliasearch";

admin.initializeApp();

const env = functions.config();

const ordersCollection = "orders";
const orderCountsCollection = "order-counts";
const orderCountsDocument = "counts";
const usersCollection = "users";
const usersCountsCollection = "user-counts";
const usersCountDocument = "counts";

type Role = "SUPER_ADMIN" | "ADMIN" | "CLIENT";


type ProductCategory = "Clothing" | "Shoes" | "Watches" | "Accessories";

type Counts = {
  [key in "All" | ProductCategory]: number;
};

type Product = {
  id:string;
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

type CartItem = {
  id: string;
  product: string;
  quantity: number;
  user: string;
  item: Product;
};

type Order = {
  id: string
  items: Pick<CartItem, "quantity" | "user" | "item">[]
  amount: number
  totalQuantity: number
  user: { id: string; name: string }
}

const stripe=new Stripe(env.stripe.secret_key, {
  apiVersion: "2020-08-27",
  typescript: true,
});

const algoliaClient=algoliasearch(env.algolia.app_id,
    env.algolia.admin_api_key);

// indici algolia
const usersIndex = algoliaClient.initIndex(usersCollection);
const productsIndex = algoliaClient.initIndex("products");
const ordersIndex = algoliaClient.initIndex(ordersCollection);

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

export const onUserCreated = functions.firestore
    .document(`${usersCollection}/{userId}`)
    .onCreate(async (snapshot, context)=>{
      const user = snapshot.data();

      // seleziono documento con i dati di conta
      const countsData = await admin.firestore()
          .collection(usersCountsCollection)
          .doc(usersCountDocument).get();

      if (!countsData.exists) {
        // primo utente devo creare il doc
        await admin.firestore()
            .collection(usersCountsCollection)
            .doc(usersCountDocument)
            .set({usersCounts: 1});
      } else {
        const {usersCounts} = countsData.data() as {usersCounts: number};

        await admin.firestore()
            .collection(usersCountsCollection)
            .doc(usersCountDocument)
            .set({usersCounts: usersCounts + 1});
      }
      // create utente in algolia
      return usersIndex.saveObject({
        objectID: snapshot.id,
        ...user,
      });
    });

export const onUserUpdated = functions.firestore
    .document(`${usersCollection}/{userId}`)
    .onUpdate(async (snapshot, context)=>{
      const user = snapshot.after.data();

      return usersIndex.saveObject({
        objectID: snapshot.after.id,
        ...user,
      });
    });

export const onUserDeleted = functions.firestore
    .document(`${usersCollection}/{userId}`)
    .onDelete(async (snapshot, context)=>{
      // seleziono documento con i dati di conta
      const countsData = await admin.firestore()
          .collection(usersCountsCollection)
          .doc(usersCountDocument).get();

      if (!countsData.exists) {
        // primo utente devo creare il doc
        return;
      } else {
        const {usersCounts} = countsData.data() as {usersCounts: number};

        await admin.firestore()
            .collection(usersCountsCollection)
            .doc(usersCountDocument)
            .set({usersCounts: usersCounts>=1 ? usersCounts - 1 : 0});
      }
      // elimino utente da aloglia
      return usersIndex.deleteObject(snapshot.id);
    });

export const updateUserRole = functions.https
    .onCall(async (data, context) =>{
      if (!context.auth) throw new Error("Non Autenticato");

      const {userId, newRole} = data as {userId: string; newRole: Role};

      // controllo auth dell'user che chiama la funzione
      const adminUser = await admin.auth().getUser(context.auth.uid);
      const {role} = adminUser.customClaims as {role: Role};
      if (role !== "SUPER_ADMIN") {
        throw new Error("Non hai i permessi necessari");
      }

      // Update the firebase auth
      await admin.auth().setCustomUserClaims(userId, {role: newRole});

      // Update user in user collection
      return admin.firestore()
          .collection(usersCollection)
          .doc(userId)
          .set({
            role: newRole,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          {merge: true});
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

      await admin.firestore().collection("product-counts")
          .doc("counts").set(counts);

      return productsIndex.saveObject({
        objectID: snapshot.id,
        ...product,
      });
    });

export const onProductUpdated = functions.firestore
    .document("products/{productId}")
    .onUpdate(async (snapshot, context) => {
      const beforeProd = snapshot.before.data() as Product;
      const afterProd = snapshot.after.data() as Product;

      // controllo se la category è cambiata o meno per aggiornare
      // paginazione

      if (beforeProd.category === afterProd.category) {
        return productsIndex.saveObject({
          objectID: snapshot.after.id,
          ...afterProd,
        });
      }

      // categoria cambiata
      const countsData = await admin.firestore()
          .collection("product-counts")
          .doc("counts").get();

      if (!countsData.exists) return;

      const counts = countsData.data() as Counts;

      // update counts
      counts[beforeProd.category] = counts[beforeProd.category] - 1;
      counts[afterProd.category] = counts[afterProd.category] + 1;


      await admin.firestore().collection("product-counts")
          .doc("counts").set(counts);

      return productsIndex.saveObject({
        objectID: snapshot.after.id,
        ...afterProd,
      });
    });

export const onProductDeleted = functions.firestore
    .document("products/{productId}")
    .onDelete(async (snapshot, context) => {
      const product = snapshot.data() as Product;

      // recuper prod-counts
      const countsData = await admin.firestore()
          .collection("product-counts")
          .doc("counts").get();

      if (!countsData.exists) return;

      const counts = countsData.data() as Counts;

      // update counts
      counts.All = counts.All -1;
      counts[product.category] = counts[product.category] - 1;

      await admin.firestore().collection("product-counts")
          .doc("counts").set(counts);
      return productsIndex.deleteObject(snapshot.id);
    });

export const onOrderCreated = functions.firestore
    .document(`${ordersCollection}/{orderId}`)
    .onCreate(async (snapshot, context) => {
      const order = snapshot.data() as Order;

      // update product inventory
      order.items.forEach((cartItem) => admin
          .firestore()
          .collection("products")
          .doc(cartItem.item.id)
          .get()
          .then((doc)=>{
            if (!doc.exists) return;

            const product = doc.data() as Product;

            return admin.firestore().collection(
                "products"
            ).doc(cartItem.item.id).set(
                {inventory:
                    product.inventory >= cartItem.quantity ?
                    product.inventory - cartItem.quantity : 0,
                },
                {merge: true}
            );
          })
      );
      // create otder-counts per paginazione

      const countsData = await admin
          .firestore()
          .collection(orderCountsCollection)
          .doc(orderCountsDocument).get();

      if (!countsData.exists) {
        // primo ordine devo creare
        await admin
            .firestore()
            .collection(orderCountsCollection)
            .doc(orderCountsDocument).set({orderCounts: 1});
      } else {
        // doc esiste già devo aggiornarlo aggiungendo
        // 1ordine
        const counts = countsData.data() as {orderCounts: number};

        await admin
            .firestore()
            .collection(orderCountsCollection)
            .doc(orderCountsDocument).set({orderCounts: counts.orderCounts +1});
      }

      return ordersIndex.saveObject({
        objectID: snapshot.id,
        ...order,
      });
    });

export const onOrderUpdated = functions.firestore
    .document(`${ordersCollection}/{orderId}`)
    .onUpdate(async (snapshot, context)=>{
      const updatedOrder = snapshot.after.data();

      return ordersIndex.saveObject({
        objectID: snapshot.after.id,
        ...updatedOrder,
      });
    });

export const onOrderDeleted = functions.firestore
    .document(`${ordersCollection}/{orderId}`)
    .onDelete(async (snapshot, context)=>{
      return ordersIndex.deleteObject(snapshot.id);
    });


export const createPaymentIntents = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) throw new Error("Non autenticato");

      const {amount, customer, paymentMethod} =
      data as {amount: number; customer?:string;paymentMethod?:string};

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        customer,
        payment_method: paymentMethod,
      });
      return {clientsSecret: paymentIntent.client_secret};
    });

export const createStripeCustomer = functions.https.onCall(
    async (_, context) => {
      if (!context.auth) throw new Error("Non autenticato");

      const customer = await stripe.customers.create(
          {email: context.auth.token.email}
      );
      // update user document per aggiungere stripeid
      await admin.firestore().collection("users").doc(context.auth.uid).set(
          {stripeCustomerId: customer.id}, {merge: true}
      );

      return {customerId: customer.id};
    });

export const setDefaultCard = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) throw new Error("Non autenticato");

      const {customerId, paymentMethod} = data as {
        customerId: string; paymentMethod: string
      };

      return stripe.customers.update(customerId, {invoice_settings: {
        default_payment_method: paymentMethod,
      }});
    });

export const listPaymentMethods = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) throw new Error("Non autenticato");

      const {customerId} = data as {customerId: string};
      // query per ottenere carte
      const paymentMethods = await stripe.paymentMethods.list(
          {customer: customerId, type: "card"}
      );
      const customer = await stripe.customers.retrieve(customerId);

      return {paymentMethods, customer};
    });

export const detachPaymentMethods = functions.https.onCall(
    async (data, context) => {
      if (!context.auth) throw new Error("Non autenticato");

      const {paymentMethod} = data as {paymentMethod: string};
      // query per ottenere carte
      const paymentMethodResult = await stripe.paymentMethods.detach(
          paymentMethod
      );
      if (!paymentMethodResult) throw new Error("Qualcosa è andato storto");

      return {paymentMethodResult};
    });
