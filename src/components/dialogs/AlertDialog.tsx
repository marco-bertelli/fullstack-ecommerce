import React from "react";
import Button from "../Button";
import DialogWrapper from "./DialogWrapper";

interface Props {
  header: string;
  message: string;
  // onOpenDialog?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  confirmText?: string
}

const AlertDialog: React.FC<Props> = ({
  header,
  message,
  onCancel,
  onConfirm,
  loading,
  error,
  confirmText
}) => {
  return (
    <DialogWrapper
      header={header}
      onClose={onCancel && !loading ? onCancel : undefined}
    >
      <div className="dialog-body">
        <div className="alert-message">{message}</div>
        <div className="aler-action">
          {onCancel && (
            <Button
              className="btn--cancel"
              onClick={() => onCancel()}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          {onConfirm && (
            <Button
              className="btn--confirm"
              onClick={() => onConfirm()}
              loading={loading}
              disabled={loading}
            >
              {confirmText ? confirmText : 'Confirm'}
            </Button>
          )}
        </div>

        {error && <p className="paragraph paragraph--error">{error}</p>}
      </div>
    </DialogWrapper>
  );
};

export default AlertDialog;
