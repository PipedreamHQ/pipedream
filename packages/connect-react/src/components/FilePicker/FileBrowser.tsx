import type { CSSProperties, FC } from "react";
import type { FileItem } from "../../adapters/file-picker/types";
import { useCustomize } from "../../hooks/customization-context";
import { Breadcrumbs } from "./Breadcrumbs";
import { FileList } from "./FileList";
import { SelectionFooter } from "./SelectionFooter";

export interface FileBrowserProps {
  path: FileItem[];
  items: FileItem[];
  selectedItems: FileItem[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  onNavigateInto: (item: FileItem) => void;
  onNavigateTo: (index: number) => void;
  onSelectionChange: (item: FileItem, selected: boolean) => void;
  onLoadMore: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  multiSelect?: boolean;
  selectFolders?: boolean;
  selectFiles?: boolean;
  showCheckboxes?: boolean;
  rootLabel?: string;
  confirmText?: string;
  cancelText?: string;
}

export const FileBrowser: FC<FileBrowserProps> = ({
  path,
  items,
  selectedItems,
  loading,
  loadingMore,
  error,
  hasMore,
  onNavigateInto,
  onNavigateTo,
  onSelectionChange,
  onLoadMore,
  onConfirm,
  onCancel,
  multiSelect = true,
  selectFolders = true,
  selectFiles = true,
  showCheckboxes = true,
  rootLabel = "Home",
  confirmText = "Select",
  cancelText = "Cancel",
}) => {
  const { theme } = useCustomize();

  const containerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.neutral0,
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${theme.colors.neutral20}`,
    flex: 1,
    minHeight: 0,
  };

  const headerStyles: CSSProperties = {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
  };

  const errorStyles: CSSProperties = {
    padding: "32px 20px",
    textAlign: "center",
    color: theme.colors.danger || "#dc2626",
    fontSize: "14px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleItemClick = (item: FileItem) => {
    if (item.canNavigateInto) {
      onNavigateInto(item);
    }
  };

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={headerStyles}>
          <Breadcrumbs path={path} onNavigate={onNavigateTo} rootLabel={rootLabel} />
        </div>
        <div style={errorStyles}>
          <p style={{ margin: 0 }}>Failed to load items</p>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: theme.colors.neutral50 }}>
            {error.message}
          </p>
        </div>
        <SelectionFooter
          selectedItems={selectedItems}
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmText={confirmText}
          cancelText={cancelText}
          confirmDisabled={true}
        />
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <Breadcrumbs path={path} onNavigate={onNavigateTo} rootLabel={rootLabel} />
      </div>

      <FileList
        items={items}
        selectedItems={selectedItems}
        onItemClick={handleItemClick}
        onSelectionChange={onSelectionChange}
        showCheckboxes={showCheckboxes}
        multiSelect={multiSelect}
        selectFolders={selectFolders}
        selectFiles={selectFiles}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
      />

      <SelectionFooter
        selectedItems={selectedItems}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmDisabled={selectedItems.length === 0}
      />
    </div>
  );
};
