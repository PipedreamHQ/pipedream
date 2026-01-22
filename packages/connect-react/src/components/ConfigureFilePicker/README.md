# ConfigureFilePicker

> **Warning**: This is an experimental/prototype component and should not be used in production. The API may change significantly in future releases.

A file picker component that uses Pipedream's `configureProp` API to fetch hierarchical options (sites, drives, folders, files) and render them in a file browser UI.

## Features

- Folder navigation with breadcrumb trail
- Single and multi-select modes
- Theming support (uses Connect React theme)
- Customizable icons
- Built-in support for SharePoint with extensible app configuration

## Usage

```tsx
import { ConfigureFilePicker, ConfigureFilePickerModal } from "@pipedream/connect-react";

// Basic usage with SharePoint
<ConfigureFilePicker
  componentKey="sharepoint-select-file"
  app="sharepoint"
  accountId={connectedAccountId}
  externalUserId={userId}
  onSelect={(items, configuredProps) => {
    console.log("Selected items:", items);
  }}
  onCancel={() => setShowPicker(false)}
/>

// Modal variant
<ConfigureFilePickerModal
  open={showPicker}
  componentKey="sharepoint-select-file"
  app="sharepoint"
  accountId={connectedAccountId}
  externalUserId={userId}
  onSelect={(items, configuredProps) => {
    console.log("Selected items:", items);
  }}
  onCancel={() => setShowPicker(false)}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `componentKey` | `string` | Yes | - | Component/action key to use (e.g., `"sharepoint-select-file"`) |
| `app` | `string` | Yes | - | App slug (e.g., `"sharepoint"`) |
| `accountId` | `string` | Yes | - | Connected account ID |
| `externalUserId` | `string` | Yes | - | External user ID for Pipedream Connect |
| `onSelect` | `(items, configuredProps) => void` | Yes | - | Callback when user confirms selection |
| `onCancel` | `() => void` | No | - | Callback when user cancels |
| `initialConfiguredProps` | `Record<string, unknown>` | No | - | Initial props for restoring previous state |
| `confirmText` | `string` | No | `"Select"` | Confirm button text |
| `cancelText` | `string` | No | `"Cancel"` | Cancel button text |
| `selectFolders` | `boolean` | No | `true` | Allow selecting folders |
| `selectFiles` | `boolean` | No | `true` | Allow selecting files |
| `multiSelect` | `boolean` | No | `false` | Allow selecting multiple items |
| `appConfig` | `FilePickerAppConfig` | No | - | Custom app configuration (overrides built-in) |
| `debug` | `boolean` | No | `false` | Enable debug logging |
| `showIcons` | `boolean` | No | `true` | Show file/folder icons |
| `icons` | `FilePickerIcons` | No | `{ folder: "📁", file: "📄" }` | Custom icons |

## Built-in App Configurations

Currently, only SharePoint has a built-in configuration:

```typescript
{
  sharepoint: {
    app: "sharepoint",
    appPropName: "sharepoint",
    propHierarchy: ["siteId", "driveId", "fileOrFolderIds"],
    propLabels: {
      siteId: "Sites",
      driveId: "Drives",
      fileOrFolderIds: "Files & Folders",
    },
    fileOrFolderProp: "fileOrFolderIds",
    folderProp: "folderId",
  }
}
```

## Custom App Configuration

To use with other apps (Google Drive, Dropbox, etc.), provide a custom `appConfig`:

```tsx
<ConfigureFilePicker
  componentKey="google_drive-select-file"
  app="google_drive"
  appConfig={{
    app: "google_drive",
    appPropName: "googleDrive",
    propHierarchy: ["driveId", "folderId", "fileId"],
    propLabels: {
      driveId: "Drives",
      folderId: "Folders",
      fileId: "Files",
    },
    fileOrFolderProp: "fileId",
    folderProp: "parentFolderId",
  }}
  // ... other props
/>
```

## How It Works

1. The component calls Pipedream's `configureProp` API to fetch options for each prop in the hierarchy
2. As the user navigates (selects a site, then a drive, etc.), it updates `configuredProps` and fetches the next level
3. At the file/folder level, users can select items which are returned via `onSelect`

## Known Limitations

- Only SharePoint has been tested; other apps may require custom configurations
- The prop hierarchy must match the component's prop definitions exactly
- No built-in search/filter functionality
- No drag-and-drop support
