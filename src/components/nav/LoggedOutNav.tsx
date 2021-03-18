
import React from "react";
import { useModalContext } from "../../state/modal-context";
import Button from "../Button";

interface Props {}

const LoggedOutNav: React.FC<Props> = () => {
  const { setModalType } = useModalContext();

  return (
    <>
      <ul className="navbar">
        <div className="navbar__profile">
       
              <Button 
              className="btn--sign"
              onClick={() => setModalType("signin")}
              >Sign in</Button>
              <Button
                className="btn--sign"
                onClick={() => setModalType("signup")}
              >
                Sign up
              </Button>
         
        </div>
      </ul>
    </>
  );
};

export default LoggedOutNav;
