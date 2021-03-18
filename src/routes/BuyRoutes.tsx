import React from 'react'
import {Switch,Route, Redirect} from 'react-router-dom';

import MyCart from '../pages/MyCart';
import SelectAdress from '../pages/SelectAdress';
import Checkout from '../pages/Checkout';
import PageNotFound from '../pages/Checkout';
import { Role } from '../types';
import { isClient } from '../helpers';

interface Props {

}

const BuyRoutes: React.FC<Props> = (props) => {
    const {userRole} =props as {userRole:Role | null}


    if (!isClient(userRole)) 
    return <Redirect to='/' />

        return (  
            <Switch>
                <Route path='/buy/my-cart'>
                    <MyCart />
                </Route>
                <Route path="/buy/select-address">
                    <SelectAdress />
                </Route>
                <Route path="/buy/checkout">
                    <Checkout />
                </Route>
                <Route path='*'>
                    <PageNotFound />
                </Route>
            </Switch>
        );
}

export default BuyRoutes