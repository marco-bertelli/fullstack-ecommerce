import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const env = functions.config();

export const onSignup = functions.https.onCall(async (data, context) => {
  // prendo il nome utente
  const {username} = data as { username: string };
  // controllo che ci sia l'utente
  if (!context.auth?.uid) return;

  // creo il ruolo dell'utente
  await admin.auth().setCustomUserClaims(context.auth.uid, {
    role: context.auth.token.email === env.admin.super_admin ?
      "SUPER_ADMIN" :
      "CLIENT",
  });

  const userRole = context.auth.token.email === env.admin.super_admin ?
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
        role: context.auth.token.email === env.admin.super_admin ?
          "SUPER_ADMIN" :
          "CLIENT",
        createdAT: admin.firestore.FieldValue.serverTimestamp(),
      });

  if (!result) return;

  return {userRole};
});
