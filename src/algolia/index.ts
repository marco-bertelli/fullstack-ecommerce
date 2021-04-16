import algoliasearch from 'algoliasearch';

const algoliaClient=algoliasearch(
    '6J1GNVZIWQ',
    '1644f1fd430940e883718d1239e01f1e'
    );

// indici algolia
export const usersIndex = algoliaClient.initIndex('users');
export const productsIndex = algoliaClient.initIndex("products");
export const ordersIndex = algoliaClient.initIndex('orders');