import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export type ButtonProps = {
  enabled: boolean;
  onClick: () => void;
};

export const LoadMoreButton = (props: ButtonProps) => {
  const {
    enabled, onClick,
  } = props;
  const {
    getProps, theme,
  } = useCustomize();

  const baseStyles: CSSProperties = {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    border: "solid 1px",
    borderColor: theme.colors.primary25,
    color: theme.colors.primary25,
    padding: "0.5rem",
    fontSize: "0.8125rem",
    fontWeight: "450",
    gridArea: "control",
    cursor: "pointer",
    width: "100%",
  };
  return (
    <button disabled={!enabled} onClick={onClick} type="button" {...getProps("loadMoreButton", baseStyles, props)}>
     Load More
    </button>
  );
};
