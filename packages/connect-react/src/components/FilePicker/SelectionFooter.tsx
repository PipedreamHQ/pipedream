import type { CSSProperties, FC } from "react";
import type { FileItem } from "../../adapters/file-picker/types";
import { useCustomize } from "../../hooks/customization-context";

export interface SelectionFooterProps {
  selectedItems: FileItem[];
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
}

export const SelectionFooter: FC<SelectionFooterProps> = ({
  selectedItems,
  onConfirm,
  onCancel,
  confirmText = "Select",
  cancelText = "Cancel",
  confirmDisabled = false,
}) => {
  const { theme } = useCustomize();

  const containerStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: `1px solid ${theme.colors.neutral20}`,
    backgroundColor: theme.colors.neutral0,
  };

  const selectionInfoStyles: CSSProperties = {
    color: theme.colors.neutral50,
    fontSize: "13px",
  };

  const buttonGroupStyles: CSSProperties = {
    display: "flex",
    gap: "8px",
  };

  const cancelButtonStyles: CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    backgroundColor: "transparent",
    border: `1px solid ${theme.colors.neutral20}`,
    color: theme.colors.neutral70,
    transition: "all 0.15s",
  };

  const confirmButtonStyles: CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: confirmDisabled ? "not-allowed" : "pointer",
    backgroundColor: confirmDisabled ? theme.colors.neutral20 : theme.colors.primary,
    border: "none",
    color: confirmDisabled ? theme.colors.neutral40 : "#fff",
    transition: "all 0.15s",
  };

  const count = selectedItems.length;
  const selectionText = count === 0 ? "No items selected" : `${count} selected`;

  return (
    <div style={containerStyles}>
      <span style={selectionInfoStyles}>{selectionText}</span>
      <div style={buttonGroupStyles}>
        <button style={cancelButtonStyles} onClick={onCancel} type="button">
          {cancelText}
        </button>
        <button
          style={confirmButtonStyles}
          onClick={onConfirm}
          disabled={confirmDisabled}
          type="button"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};
