import React, {
  type FC, type CSSProperties, useEffect, useRef, useCallback,
} from "react";
import { useCustomize } from "../../hooks/customization-context";
import {
  ConfigureFilePicker, type ConfigureFilePickerProps,
} from "./index";

export interface ConfigureFilePickerModalProps extends ConfigureFilePickerProps {
  isOpen: boolean;
  title?: string;
}

export const ConfigureFilePickerModal: FC<ConfigureFilePickerModalProps> = ({
  isOpen,
  title = "Select Files",
  onCancel,
  ...configureFilePickerProps
}) => {
  const { theme } = useCustomize();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Combined keyboard handler for Escape and Tab (focus trap)
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element to restore on close
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Set initial focus to close button
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape to close modal
      if (e.key === "Escape") {
        onCancel?.();
        return;
      }

      // Handle Tab for focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus when modal closes
      previouslyFocusedRef.current?.focus?.();
    };
  }, [
    isOpen,
    onCancel,
  ]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  }, [
    onCancel,
  ]);

  if (!isOpen) return null;

  const overlayStyles: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const modalStyles: CSSProperties = {
    backgroundColor: theme.colors.neutral0 || "#fff",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "720px",
    height: "min(600px, calc(100vh - 40px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyles: CSSProperties = {
    padding: "16px 20px",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyles: CSSProperties = {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: theme.colors.neutral80,
  };

  const closeButtonStyles: CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: theme.colors.neutral40,
    padding: "4px",
    lineHeight: 1,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    transition: "background-color 0.15s",
  };

  const contentStyles: CSSProperties = {
    padding: "16px",
    overflow: "hidden",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  };

  return (
    <div
      style={overlayStyles}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div style={headerStyles}>
          <h2 id="modal-title" style={titleStyles}>{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            style={closeButtonStyles}
            onClick={onCancel}
            aria-label="Close"
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = theme.colors.neutral10 || "";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "";
            }}
          >
            ×
          </button>
        </div>
        <div style={contentStyles}>
          <ConfigureFilePicker {...configureFilePickerProps} onCancel={onCancel} />
        </div>
      </div>
    </div>
  );
};
