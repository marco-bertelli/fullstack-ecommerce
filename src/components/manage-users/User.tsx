import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserInfo } from "../../types";
import Button from "../Button";
import { useUpdateRole } from "../../hooks/useUpdateRole";

interface Props {
  user: UserInfo;
  admin: UserInfo;
}

const User: React.FC<Props> = ({
  user: {id, username, email, createdAt, role },
  admin,
}) => {
  const [newRole, setNewRole] = useState(role);
  const [isEditing, setisEditing] = useState(false);
  const {updateRole, loading, error} = useUpdateRole();

  const handleUpdateRole = async () =>{
    if (role === newRole) return

    const finished = await updateRole(id, newRole)
    if (finished) setisEditing(false)

    if(error) alert(error)
  }

  return (
    <tr>
      {/* User name */}
      <td className="table-cell" style={{ width: "20%" }}>
        {username}
      </td>

      {/* Email */}
      <td className="table-cell" style={{ width: "25%" }}>
        {email}
      </td>

      {/* CreatedAt */}
      <td className="table-cell">
        {createdAt && createdAt.toDate().toDateString()}
      </td>

      {/* Role - Client */}
      <td className="table-cell">
        {newRole === "CLIENT" ? (
          <FontAwesomeIcon
            icon={["fas", "check-circle"]}
            style={{
              cursor: isEditing ? "pointer" : undefined,
              color: isEditing ? "green" : undefined,
            }}
            size="1x"
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={["fas", "times-circle"]}
            style={{
              cursor: "pointer",
              color: "red",
            }}
            size="1x"
            onClick={() => setNewRole("CLIENT")}
          />
        ) : (
          ""
        )}
      </td>

      {/* Role - Admin */}
      <td className="table-cell">
        {newRole === "ADMIN" ? (
          <FontAwesomeIcon
            icon={["fas", "check-circle"]}
            style={{
              cursor: isEditing ? "pointer" : undefined,
              color: isEditing ? "green" : undefined,
            }}
            size="1x"
          />
        ) : isEditing ? (
          <FontAwesomeIcon
            icon={["fas", "times-circle"]}
            style={{
              cursor: "pointer",
              color: "red",
            }}
            size="1x"
            onClick={() => setNewRole("ADMIN")}
          />
        ) : (
          ""
        )}
      </td>

      {/* Role - Super Admin */}
      <td className="table-cell">
        {role === "SUPER_ADMIN" ? (
          <FontAwesomeIcon icon={["fas", "check-circle"]} size="1x" />
        ) : (
          ""
        )}
      </td>

      {/* Edit */}
      {admin.role === "SUPER_ADMIN" && (
        <td className="table-cell">
          {role !== "SUPER_ADMIN" &&<>{!isEditing ? (
            <FontAwesomeIcon
              icon={["fas", "edit"]}
              size="1x"
              style={{cursor:'pointer'}}
              onClick={() => setisEditing(true)}
            />
          ) : (
            <div className="table__update-action">
              <Button
                width="40%"
                height="2rem"
                className="btn--cancel"
                style={{ fontSize: "1rem" }}
                onClick={() => {
                  setNewRole(role)
                  setisEditing(false)
                }}
                disabled={loading}
              >
                Cancella
              </Button>
              <Button
                width="40%"
                height="2rem"
                className="btn--confirm"
                style={{ fontSize: "1rem" }}
                onClick={handleUpdateRole}
                loading={loading}
                spinnerHeight={10}
                spinnerWidth={10}
                disabled={loading || role === newRole}
              >
                Conferma
              </Button>
            </div>
          )}</>}
        </td>
      )}
    </tr>
  );
};

export default User;
