import React from 'react'
import { Order } from '../types'

interface Props {
order: Order
}

const OrderItem: React.FC<Props> = ({order}) => {
        return <div>{order.id}</div>
}

export default OrderItem