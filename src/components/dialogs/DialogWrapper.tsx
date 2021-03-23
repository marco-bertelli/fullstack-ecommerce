import React from "react";

interface Props {
  header: string;
  onOpen?: (open: boolean) => void;
}

const DialogWrapper: React.FC<Props> = ({ children, header, onOpen }) => {
  return (
    <div>
      <div
        className="backdrop"
        onClick={onOpen ? () => onOpen(false) : undefined}
      ></div>

      <div className="modal modal--dialog">
        <div
          className="modal-close"
          onClick={onOpen ? () => onOpen(false) : undefined}
        >
          &times;
        </div>

        <h3 className="header">{header}</h3>

        <div className="dialog">{children}</div>
      </div>
    </div>
  );
};

export default DialogWrapper;
