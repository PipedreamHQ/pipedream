import type { CSSProperties } from "react";
import type { Theme } from "../theme";

export const getInputStyles = (theme: Theme): CSSProperties => ({
  color: theme.colors.neutral80,
  backgroundColor: theme.colors.neutral20,
  border: "1px solid",
  borderColor: theme.colors.neutral20,
  padding: 6,
  borderRadius: theme.borderRadius,
  boxShadow: theme.boxShadow.input,
  flex: 1,
});

export const getButtonStyles = (theme: Theme): CSSProperties => ({
  color: theme.colors.neutral80,
  backgroundColor: "transparent",
  display: "inline-flex",
  alignItems: "center",
  padding: `${theme.spacing.baseUnit}px ${theme.spacing.baseUnit * 1.5}px ${
    theme.spacing.baseUnit
  }px ${theme.spacing.baseUnit * 2.5}px`,
  border: `1px solid ${theme.colors.neutral30}`,
  borderRadius: theme.borderRadius,
  cursor: "pointer",
  fontSize: "0.8125rem",
  fontWeight: 450,
  gap: theme.spacing.baseUnit * 2,
  textWrap: "nowrap",
});

export const getRemoveButtonStyles = (theme: Theme): CSSProperties => ({
  ...getButtonStyles(theme),
  flex: "0 0 auto",
  padding: "6px 8px",
});

export const getContainerStyles = (): CSSProperties => ({
  gridArea: "control",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const getItemStyles = (): CSSProperties => ({
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
});
