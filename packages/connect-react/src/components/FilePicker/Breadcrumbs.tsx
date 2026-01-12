import type { CSSProperties, FC } from "react";
import type { FileItem } from "../../adapters/file-picker/types";
import { useCustomize } from "../../hooks/customization-context";

export interface BreadcrumbsProps {
  path: FileItem[];
  onNavigate: (index: number) => void;
  rootLabel?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  path,
  onNavigate,
  rootLabel = "Home",
}) => {
  const { theme } = useCustomize();

  const containerStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "13px",
    color: theme.colors.neutral60,
    overflow: "hidden",
  };

  const linkStyles: CSSProperties = {
    color: theme.colors.neutral60,
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    transition: "color 0.15s",
  };

  const currentStyles: CSSProperties = {
    color: theme.colors.neutral80,
    padding: "2px 4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const separatorStyles: CSSProperties = {
    color: theme.colors.neutral30,
    flexShrink: 0,
  };

  return (
    <nav style={containerStyles} aria-label="Breadcrumb">
      <span
        onClick={() => onNavigate(-1)}
        style={path.length === 0 ? currentStyles : linkStyles}
        role={path.length === 0 ? undefined : "button"}
        tabIndex={path.length === 0 ? undefined : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onNavigate(-1);
        }}
        onMouseEnter={(e) => {
          if (path.length > 0) (e.target as HTMLElement).style.color = theme.colors.primary || "";
        }}
        onMouseLeave={(e) => {
          if (path.length > 0) (e.target as HTMLElement).style.color = theme.colors.neutral60 || "";
        }}
      >
        {rootLabel}
      </span>

      {path.map((item, index) => (
        <span key={item.id} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          <span style={separatorStyles}>/</span>
          <span
            onClick={() => onNavigate(index)}
            style={index === path.length - 1 ? currentStyles : linkStyles}
            role={index === path.length - 1 ? undefined : "button"}
            tabIndex={index === path.length - 1 ? undefined : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigate(index);
            }}
            onMouseEnter={(e) => {
              if (index < path.length - 1) (e.target as HTMLElement).style.color = theme.colors.primary || "";
            }}
            onMouseLeave={(e) => {
              if (index < path.length - 1) (e.target as HTMLElement).style.color = theme.colors.neutral60 || "";
            }}
          >
            {item.name}
          </span>
        </span>
      ))}
    </nav>
  );
};
