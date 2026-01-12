import type { CSSProperties, FC } from "react";
import type { FileItem } from "../../adapters/file-picker/types";
import { useCustomize } from "../../hooks/customization-context";

export interface FileListProps {
  items: FileItem[];
  selectedItems: FileItem[];
  onItemClick: (item: FileItem) => void;
  onSelectionChange: (item: FileItem, selected: boolean) => void;
  showCheckboxes?: boolean;
  multiSelect?: boolean;
  selectFolders?: boolean;
  selectFiles?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export const FileList: FC<FileListProps> = ({
  items,
  selectedItems,
  onItemClick,
  onSelectionChange,
  showCheckboxes = true,
  selectFolders = true,
  selectFiles = true,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}) => {
  const { theme } = useCustomize();

  const listStyles: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    flex: 1,
    overflowY: "auto",
  };

  const itemStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "background-color 0.1s",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
  };

  const checkboxStyles: CSSProperties = {
    marginRight: "10px",
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: theme.colors.primary,
  };

  const nameStyles: CSSProperties = {
    flex: 1,
    fontSize: "14px",
    color: theme.colors.neutral80,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const metaStyles: CSSProperties = {
    color: theme.colors.neutral40,
    fontSize: "12px",
    marginLeft: "12px",
  };

  const chevronStyles: CSSProperties = {
    color: theme.colors.neutral30,
    marginLeft: "8px",
    fontSize: "12px",
  };

  const emptyStyles: CSSProperties = {
    padding: "40px 20px",
    textAlign: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const loadingStyles: CSSProperties = {
    padding: "40px 20px",
    textAlign: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const loadMoreStyles: CSSProperties = {
    padding: "8px",
    textAlign: "center",
    borderTop: `1px solid ${theme.colors.neutral10}`,
  };

  const loadMoreButtonStyles: CSSProperties = {
    padding: "6px 12px",
    fontSize: "13px",
    color: theme.colors.primary,
    background: "none",
    border: "none",
    cursor: loadingMore ? "default" : "pointer",
    opacity: loadingMore ? 0.6 : 1,
  };

  const formatSize = (bytes?: number): string => {
    if (bytes === undefined) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const isSelectable = (item: FileItem): boolean => {
    if (item.type === "folder" || item.type === "drive" || item.type === "site") {
      return selectFolders;
    }
    return selectFiles;
  };

  const isSelected = (item: FileItem): boolean => {
    return selectedItems.some((i) => i.id === item.id);
  };

  const handleCheckboxChange = (item: FileItem, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectionChange(item, e.target.checked);
  };

  const handleItemClick = (item: FileItem) => {
    if (item.canNavigateInto) {
      onItemClick(item);
    } else if (isSelectable(item)) {
      onSelectionChange(item, !isSelected(item));
    }
  };

  const containerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={containerStyles}>
        <div style={emptyStyles}>No items found</div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <ul style={listStyles}>
        {items.map((item) => {
          const selectable = isSelectable(item);
          const selected = isSelected(item);

          return (
            <li
              key={item.id}
              style={{
                ...itemStyles,
                backgroundColor: selected ? theme.colors.primary25 : undefined,
              }}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                if (!selected) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = theme.colors.neutral5 || "";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = selected
                  ? theme.colors.primary25 || ""
                  : "";
              }}
            >
              {showCheckboxes && selectable && (
                <input
                  type="checkbox"
                  style={checkboxStyles}
                  checked={selected}
                  onChange={(e) => handleCheckboxChange(item, e)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {showCheckboxes && !selectable && <div style={{ width: "26px" }} />}

              <span style={nameStyles}>{item.name}</span>

              {item.type === "file" && item.size !== undefined && (
                <span style={metaStyles}>{formatSize(item.size)}</span>
              )}

              {item.canNavigateInto && <span style={chevronStyles}>›</span>}
            </li>
          );
        })}
      </ul>

      {hasMore && onLoadMore && (
        <div style={loadMoreStyles}>
          <button
            style={loadMoreButtonStyles}
            onClick={(e) => {
              e.stopPropagation();
              onLoadMore();
            }}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};
