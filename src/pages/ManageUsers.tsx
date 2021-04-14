import React from 'react'
import { useFetchUsers } from '../hooks/usefetchUsers'
import { useAuthContext } from '../state/auth-context'

interface Props {

}

const ManageUsers: React.FC<Props> = () => {
        const {authState: {userInfo}} = useAuthContext()
        const {users, userCounts, loading, error} = useFetchUsers(userInfo)
        console.log(users)
        return <div>ManageUsers</div>
}

export default ManageUsers