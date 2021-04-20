import React, { useEffect, useState } from "react";
import User from "../components/manage-users/User";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useFetchUsers } from "../hooks/usefetchUsers";
import { usePagination } from "../hooks/usePagination";
import { useAuthContext } from "../state/auth-context";
import { useSearchContext } from "../state/search-context";
import { UserInfo } from "../types";

const usersPerPage = 20;

interface Props {}

const ManageUsers: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();
  const { searchedItems } = useSearchContext();
  const { users, userCounts, loading, error, queryMoreUsers } = useFetchUsers(userInfo);
  
  const {page, totalPages} = usePagination(userCounts, usersPerPage, undefined, searchedItems as UserInfo[])
  // state per paginazione
  const [usersByPage, setUsersByPage] = useState(users)
  const [paginatedSearchedItems,setPaginatedSearchItems] = useState(searchedItems)

  // effetto per paginazione
  useEffect(() => {
    const startIndex = usersPerPage * (page -1)
    const endIndex = usersPerPage * page
    if(searchedItems){
      setPaginatedSearchItems(searchedItems.slice(startIndex,endIndex))
      setUsersByPage([])
    } else {
      if(!users) return

      // controllo se devo recuperare altri utenti
      if (users.length<userCounts && users.length < usersPerPage * page){
        queryMoreUsers()
        return
      }

      setUsersByPage(users.slice(startIndex,endIndex))
      setPaginatedSearchItems(null)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchedItems, users, page, userCounts])

  if (loading || userInfo == null)
    return <Spinner color="grey" width={50} height={50} />;
  if (error) return <h2 className="header--center">{error}</h2>;

  if (!users || users.length === 0)
    return <h2 className="header--center">Nessun Utente</h2>;

  return (
    <div className="page--manage-users">
      <h2 className="header-center">Amministra Utenti</h2>

      <Pagination page={page} totalPages={totalPages} />

      <table className="table table--manage-users">
        <thead>
          <tr>
            {/* Header */}
            <th className="table-cell" style={{ width: "20%" }} rowSpan={2}>
              Nome
            </th>
            <th className="table-cell" style={{ width: "25%" }} rowSpan={2}>
              Email
            </th>
            <th className="table-cell" rowSpan={2}>
              Created At
            </th>

            <th className="table-cell" style={{ width: "25%" }} colSpan={3}>
              Ruolo
            </th>
          </tr>

          {/* Sub header */}
          <tr>
            <th className="table-cell">Client</th>
            <th className="table-cell">Admin</th>
            <th className="table-cell">Super</th>
          </tr>
        </thead>

        <tbody>
          {paginatedSearchedItems ? (
            <>
              {paginatedSearchedItems.length < 1 ? (
                <tr>
                  <td colSpan={6}>
                    <h2 className="header--center">Nessun Utente Trovato</h2>
                  </td>
                </tr>
              ) : (
                (paginatedSearchedItems as UserInfo[]).map((user) => (
                  <User key={user.id} user={user} admin={userInfo} />
                ))
              )}
            </>
          ) : (
            usersByPage && usersByPage.map((user) => (
              <User key={user.id} user={user} admin={userInfo} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
