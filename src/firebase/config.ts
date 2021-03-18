 import firebase from 'firebase/app';
 import 'firebase/auth';
 import 'firebase/functions';
 import 'firebase/firestore';

 /** 
    * ! attenzione questa è una demo ma in un ambiente di prod le variabili di conf
    * ! vanno messe dentro un file .env e non esposte ! 
    * ! non farlo esporrà l'app a gravi problemi di sicurezza
    * TODO:mettere appunto queste conf in un file env
 */

 const firebaseConfig = {
    apiKey: "AIzaSyCQQ0q97-vXvebdhUpYQUFxxjsJPjcO5us",
    authDomain: "fullstack-ecommerce-de2da.firebaseapp.com",
    projectId: "fullstack-ecommerce-de2da",
    storageBucket: "fullstack-ecommerce-de2da.appspot.com",
    messagingSenderId: "359371891006",
    appId: "1:359371891006:web:6816d9bbfb44a47f2b8c6f"
  };


  /**
   * * configurazione dell'autenticazione firebase
   */
  firebase.initializeApp(firebaseConfig);

  export const auth=firebase.auth();
  export const functions=firebase.functions();
  export const db = firebase.firestore();
  export {firebase}