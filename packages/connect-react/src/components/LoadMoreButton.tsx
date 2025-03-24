import { useCustomize } from "../hooks/customization-context";
import type { CSSProperties } from "react";

export type ButtonProps = {
  onChange: () => void;
};

export const LoadMoreButton = (props: ButtonProps) => {
  const { onChange } = props;
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
    <button onClick={onChange} type="button" {...getProps("loadMoreButton", baseStyles, props)}>
      Load More
    </button>
  );
};
