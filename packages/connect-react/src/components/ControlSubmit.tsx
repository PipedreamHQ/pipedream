import { FormContext } from "../hooks/form-context";
import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export type ControlSubmitProps = {
  form: FormContext;
};

export function ControlSubmit(props: ControlSubmitProps) {
  const { form } = props;
  const {
    propsNeedConfiguring, submitting,
  } = form;

  const {
    getProps, theme,
  } = useCustomize();
  const baseStyles = (disabled: boolean): CSSProperties => ({
    width: "fit-content",
    textTransform: "capitalize",
    backgroundColor: disabled
      ? theme.colors.neutral10
      : theme.colors.primary,
    color: disabled
      ? theme.colors.neutral40
      : theme.colors.neutral0,
    padding: `${theme.spacing.baseUnit * 1.75}px ${
      theme.spacing.baseUnit * 16
    }px`,
    borderRadius: theme.borderRadius,
    boxShadow: theme.boxShadow?.button,
    cursor: "pointer",
    fontSize: "0.875rem",
    opacity: submitting
      ? 0.5
      : undefined,
    margin: "0.5rem 0 0 0",
  });

  return <input type="submit" value={submitting
    ? "Submitting..."
    : "Submit"} {...getProps("controlSubmit", baseStyles(propsNeedConfiguring.length || submitting), props)} disabled={propsNeedConfiguring.length || submitting} />;
}
