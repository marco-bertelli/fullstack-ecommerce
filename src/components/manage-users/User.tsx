import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserInfo } from "../../types";

interface Props {
  user: UserInfo;
  admin: UserInfo;
}

const User: React.FC<Props> = ({
  user: { username, email, createdAt, role },
  admin,
}) => {
  const [newRole, setNewRole] = useState(role);
  const [isEditing, setisEditing] = useState(false);

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
              color: "red"
            }}
            size="1x"
            onClick={() => setNewRole('CLIENT')}
          />
        ) : (
          ""
        )}
      </td>

      {/* Role - Admin */}
      <td className="table-cell">
        {role === "ADMIN" ? (
          <FontAwesomeIcon icon={["fas", "check-circle"]} size="1x" />
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
          {role !== "SUPER_ADMIN" ? (
            <FontAwesomeIcon icon={["fas", "edit"]} size="1x" />
          ) : (
            ""
          )}
        </td>
      )}
    </tr>
  );
};

export default User;
