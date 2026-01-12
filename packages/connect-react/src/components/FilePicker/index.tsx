import { useState, useCallback, type FC } from "react";
import type { FileItem } from "../../adapters/file-picker/types";
import { useFilePicker } from "../../hooks/use-file-picker";
import { FileBrowser } from "./FileBrowser";
import type { FilePickerProps } from "./types";

export type { FilePickerProps } from "./types";
export type { FileItem, ProxyRequestFn, ProxyRequestOptions } from "../../adapters/file-picker/types";
export { FilePickerModal, type FilePickerModalProps } from "./FilePickerModal";

export const FilePicker: FC<FilePickerProps> = ({
  app,
  accountId,
  externalUserId,
  proxyRequest,
  onSelect,
  onCancel,
  multiSelect = true,
  selectFolders = true,
  selectFiles = true,
  showCheckboxes = true,
  rootLabel,
  confirmText,
  cancelText,
}) => {
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([]);

  const {
    path,
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    navigateInto,
    navigateTo,
    loadMore,
  } = useFilePicker({
    app,
    accountId,
    externalUserId,
    proxyRequest,
    enabled: true,
  });

  const handleSelectionChange = useCallback(
    (item: FileItem, selected: boolean) => {
      setSelectedItems((prev) => {
        if (selected) {
          if (multiSelect) {
            return [...prev, item];
          }
          return [item];
        }
        return prev.filter((i) => i.id !== item.id);
      });
    },
    [multiSelect]
  );

  const handleConfirm = useCallback(() => {
    onSelect(selectedItems);
  }, [onSelect, selectedItems]);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  return (
    <FileBrowser
      path={path}
      items={items}
      selectedItems={selectedItems}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasMore={hasMore}
      onNavigateInto={navigateInto}
      onNavigateTo={navigateTo}
      onSelectionChange={handleSelectionChange}
      onLoadMore={loadMore}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      multiSelect={multiSelect}
      selectFolders={selectFolders}
      selectFiles={selectFiles}
      showCheckboxes={showCheckboxes}
      rootLabel={rootLabel}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
};
