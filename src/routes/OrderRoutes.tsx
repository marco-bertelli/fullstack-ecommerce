import React from 'react'
import {Switch,Route, Redirect} from 'react-router-dom';
import { isClient } from '../helpers';


import Orders from '../pages/Order';
import OrderDetail from '../pages/OrderDetail';
import PageNotFound from '../pages/PageNotFound';
import OrdersContextProvider from '../state/orders-context';
import { Role } from '../types';


interface Props {

}

const OrderRoutes: React.FC<Props> = (props) => {
    const {userRole} =props as {userRole:Role | null}


    if (!isClient(userRole)) 
    return <Redirect to='/' />
    
        return (
            <OrdersContextProvider>
            <Switch>
                <Route path="/orders/my-orders/:id">
                    <OrderDetail />
                </Route>

                <Route path="/orders/my-orders">
                    <Orders />
                </Route>

                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
            </OrdersContextProvider>

        );
}

export default OrderRoutes