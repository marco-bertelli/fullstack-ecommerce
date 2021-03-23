import React from "react";

interface Props {
  header: string;
  onClose?: (open: boolean) => void;
}

const DialogWrapper: React.FC<Props> = ({ children, header, onClose }) => {
  return (
    <div>
      <div
        className="backdrop"
        onClick={onClose ? () => onClose(false) : undefined}
      ></div>

      <div className="modal modal--dialog">
        <div
          className="modal-close"
          onClick={onClose ? () => onClose(false) : undefined}
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
