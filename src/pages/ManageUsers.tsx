import React from "react";
import User from "../components/manage-users/User";
import Spinner from "../components/Spinner";
import { useFetchUsers } from "../hooks/usefetchUsers";
import { useAuthContext } from "../state/auth-context";
import { useSearchContext } from "../state/search-context";
import { UserInfo } from "../types";

interface Props {}

const ManageUsers: React.FC<Props> = () => {
  const {
    authState: { userInfo },
  } = useAuthContext();
  const { searchedItems } = useSearchContext();

  const { users, userCounts, loading, error } = useFetchUsers(userInfo);
  if (loading || userInfo == null)
    return <Spinner color="grey" width={50} height={50} />;
  if (error) return <h2 className="header--center">{error}</h2>;

  if (!users || users.length === 0)
    return <h2 className="header--center">Nessun Utente</h2>;

  return (
    <div className="page--manage-users">
      <h2 className="header-center">Amministra Utenti</h2>

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
          {searchedItems ? (
            <>
              {searchedItems.length < 1 ? (
                <tr>
                  <td colSpan={6}>
                    <h2 className="header--center">Nessun Utente Trovato</h2>
                  </td>
                </tr>
              ) : (
                (searchedItems as UserInfo[]).map((user) => (
                  <User key={user.id} user={user} admin={userInfo} />
                ))
              )}
            </>
          ) : (
            users.map((user) => (
              <User key={user.id} user={user} admin={userInfo} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
