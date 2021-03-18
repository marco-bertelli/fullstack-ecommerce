import React from 'react'
import { isAdmin, isClient } from '../../helpers';
import { useAuthenticate } from '../../hooks/useAuthentication';
import { useAuthContext,openUserDropdown, signoutRedirect } from '../../state/auth-context';
import { useViewContext } from '../../state/view-context';
import Button from '../Button';
import AdminDropdown from './AdminDropdown';
import ClientDropdown from './ClientDropdown';

interface Props {

}

const UserDropdown: React.FC<Props> = () => {

    const {authState:{authUser,userRole},authDispatch} = useAuthContext()

    //hook gestore stato utente
    const {signout} = useAuthenticate();
    const {viewMode} = useViewContext()

        return (
            <div className="page page--sidebar">
                <div className="sidebar sidebar-show" onMouseLeave={()=>authDispatch(openUserDropdown(false))}>
                    <div className="sidebar__section sidebar__section--profile">
                        <h3 className="header--center header--sidebar">
                            {authUser?.displayName}
                        </h3>
                        <h3 className="header--center header--sidebar">
                            {authUser?.email}
                        </h3>
                    </div>
                    

                    {/*  voci per admin  */}

                    {isAdmin(userRole) && <AdminDropdown />}

                    {/* Utente Client */}
                    {(isClient(userRole) || (isAdmin(userRole) && viewMode === 'client')) && <ClientDropdown />}  
                    

                    {/* logout */}
                    <div className="sidebar__section">
                        <Button className='btn--siderbar-signout' onClick={()=>{ 
                            signout()
                            authDispatch(signoutRedirect(true))
                        }}>Logout</Button>
                    </div>
                    {/* chiudere sidebar */}
                    <div className="sidebar__section">
                        <Button className="sidebar__close" onClick={()=>authDispatch(openUserDropdown(false))}>&times;</Button>
                    </div>
                </div>
            </div>
        );
}

export default UserDropdown