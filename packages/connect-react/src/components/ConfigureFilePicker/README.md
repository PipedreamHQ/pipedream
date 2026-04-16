# ConfigureFilePicker

A file picker component that uses Pipedream's `configureProp` API to navigate hierarchical file systems (sites, drives, folders, files) and return selected items.

## How It Works

The file picker is a **UI layer** on top of a **backing Pipedream action**. The action defines the props (site, drive, folder, files) and their options; the picker renders those options in a browseable file-system UI.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  ConfigureFilePicker (React)                                │
│                                                             │
│  propHierarchy: [siteId, driveId, fileIds]                  │
│                                                             │
│  For each prop in the hierarchy:                            │
│    1. Call configureProp(propName, configuredProps)          │
│    2. Render returned options as a browseable list           │
│    3. On user selection, add to configuredProps              │
│    4. Advance to next prop in hierarchy                     │
│                                                             │
│  At the file level (fileOrFolderProp):                      │
│    - Render checkboxes for selection                         │
│    - Clicking a folder sets folderId and re-fetches          │
│    - onSelect returns selected FilePickerItems              │
└──────────────────────┬──────────────────────────────────────┘
                       │ configureProp API calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Backing Action (e.g., sharepoint-retrieve-file-metadata)   │
│                                                             │
│  Props with async options():                                │
│    siteId    → returns [{ label, value: "id" }]             │
│    driveId   → returns [{ label, value: "id" }]             │
│    folderId  → returns [{ label, value: "id" }]  (optional) │
│    fileIds   → returns [{ label, value: JSON }]             │
│                                                             │
│  The file-level prop returns JSON-stringified metadata       │
│  so the picker can display size, dates, folder indicators   │
└─────────────────────────────────────────────────────────────┘
```

### The configureProp Loop

Each time the user selects an item, the picker:

1. Stores the selection in `configuredProps` (e.g., `{ siteId: "abc123" }`)
2. Advances to the next prop in `propHierarchy`
3. Calls `configureProp` with the updated `configuredProps`, which the backing action uses to fetch the next level of options (e.g., drives within that site)

### Folder Navigation

When the user clicks a folder at the file level, the picker doesn't advance to a new prop — instead it sets `folderId` in `configuredProps` and re-fetches the same file-level prop. The backing action's options function receives `folderId` and returns items from within that folder.

### Option Value Formats

**Navigation props** (siteId, driveId) return simple string IDs:
```js
{ label: "My Site", value: "site-id-123" }
```

**File-level props** return JSON-stringified metadata so the picker can show rich info:
```js
{
  label: "report.pdf",
  value: JSON.stringify({
    id: "file-id-456",
    name: "report.pdf",
    isFolder: false,
    size: 245760,
    lastModifiedDateTime: "2026-03-18T14:22:31Z",
    webUrl: "https://contoso.sharepoint.com/sites/Project/Shared%20Documents/report.pdf",
    description: "Q1 Sales Report"
  })
}
```

For folders at the file level:
```js
{
  label: "Archive",
  value: JSON.stringify({
    id: "folder-id-789",
    name: "Archive",
    isFolder: true,        // Tells the picker this is navigable
    childCount: 5,         // Displayed as "5 items"
    lastModifiedDateTime: "2026-03-10T09:15:00Z",
    webUrl: "https://contoso.sharepoint.com/sites/Project/Shared%20Documents/Archive"
  })
}
```

The `isFolder` field is critical — the picker uses it to decide whether clicking an item navigates into it or selects it.

---

## FilePickerAppConfig

Each app needs a configuration object that tells the picker how to navigate its hierarchy:

```typescript
interface FilePickerAppConfig {
  /** App slug as registered in Pipedream (e.g., "sharepoint") */
  app: string;

  /** camelCase prop name for the app in the backing action (e.g., "sharepoint", "googleDrive") */
  appPropName: string;

  /** Ordered list of prop names to navigate through */
  propHierarchy: string[];

  /** Display labels for breadcrumb at each navigation level */
  propLabels: Record<string, string>;

  /** The prop name that shows selectable files (last in hierarchy) */
  fileOrFolderProp: string;

  /** Prop name used when drilling into folders (set in configuredProps on folder click) */
  folderProp?: string;

  /** Icons for items at each navigation level (keyed by prop name) */
  propIcons?: Record<string, ReactNode>;
}
```

### Built-in Configurations

#### SharePoint (files and folders)
```typescript
{
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
  propIcons: {
    siteId: <GlobeIcon />,
    driveId: <FolderIcon />,
  },
}
```

#### SharePoint Admin (files only)
```typescript
{
  app: "sharepoint_admin",
  appPropName: "sharepointAdmin",
  propHierarchy: ["siteId", "driveId", "fileIds"],
  propLabels: {
    siteId: "Sites",
    driveId: "Drives",
    fileIds: "Files",
  },
  fileOrFolderProp: "fileIds",
  folderProp: "folderId",
  propIcons: {
    siteId: <GlobeIcon />,
    driveId: <FolderIcon />,
  },
}
```

---

## Adding a New App

To add file picker support for a new cloud storage provider (e.g., Google Drive, Dropbox, Box):

### 1. Create the backing action

The action needs props that follow the hierarchical pattern. Each prop must have an `async options()` that returns `[{ label, value }]` pairs.

**Requirements:**
- Navigation props (drives, etc.) return `{ label: string, value: string }` — simple ID values
- The file-level prop returns `{ label: string, value: JSON.stringify({...}) }` with at minimum:
  - `id` (string) — unique identifier
  - `name` (string) — display name
  - `isFolder` (boolean) — **required** for folder navigation to work
- Optional metadata fields in the JSON value: `size`, `childCount`, `lastModifiedDateTime`, `webUrl`, `description`
- A `folderId`-equivalent prop (optional, for drilling into folders) that accepts a folder ID and causes the file-level prop's options to return contents of that folder
- All navigation props should use `withLabel: true` so the picker can read labels

**Example prop structure for Google Drive:**
```javascript
props: {
  googleDrive,                           // App reference
  driveId: {                             // Optional: select a shared drive
    propDefinition: [googleDrive, "driveId"],
    withLabel: true,
  },
  folderId: {                            // For folder drilling
    propDefinition: [googleDrive, "folderId", (c) => ({ driveId: c.driveId })],
    optional: true,
    withLabel: true,
  },
  fileIds: {                             // File-level prop
    propDefinition: [googleDrive, "fileOrFolderId", (c) => ({
      driveId: c.driveId,
      folderId: c.folderId,
    })],
    type: "string[]",
    label: "Files",
    withLabel: true,
  },
}
```

**Example options() for the file-level prop:**
```javascript
async options({ driveId, folderId }) {
  const items = await this.listFiles({ driveId, folderId });
  return items.map((item) => ({
    label: item.name,
    value: JSON.stringify({
      id: item.id,
      name: item.name,
      isFolder: item.mimeType === "application/vnd.google-apps.folder",
      size: item.size ? parseInt(item.size) : undefined,
      lastModifiedDateTime: item.modifiedTime,
      webUrl: item.webViewLink,
    }),
  }));
}
```

### 2. Add the app config to FILE_PICKER_APPS

```typescript
// In ConfigureFilePicker/index.tsx
google_drive: {
  app: "google_drive",
  appPropName: "googleDrive",
  propHierarchy: ["driveId", "fileIds"],
  propLabels: {
    driveId: "Drives",
    fileIds: "Files",
  },
  fileOrFolderProp: "fileIds",
  folderProp: "folderId",
  propIcons: {
    driveId: <FolderIcon />,
  },
},
```

### 3. Use the picker

```tsx
<ConfigureFilePicker
  componentKey="google_drive-retrieve-file-metadata"
  app="google_drive"
  accountId={connectedAccountId}
  externalUserId={userId}
  onSelect={(items, configuredProps) => {
    console.log("Selected:", items);
  }}
/>
```

Or pass a custom config without modifying the source:

```tsx
<ConfigureFilePicker
  componentKey="google_drive-retrieve-file-metadata"
  app="google_drive"
  appConfig={{
    app: "google_drive",
    appPropName: "googleDrive",
    propHierarchy: ["driveId", "fileIds"],
    propLabels: { driveId: "Drives", fileIds: "Files" },
    fileOrFolderProp: "fileIds",
    folderProp: "folderId",
  }}
  // ...
/>
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `componentKey` | `string` | Yes | - | Backing action key (e.g., `"sharepoint-retrieve-file-metadata"`) |
| `app` | `string` | Yes | - | App slug (e.g., `"sharepoint"`) — must match a key in `FILE_PICKER_APPS` or provide `appConfig` |
| `accountId` | `string` | Yes | - | Connected account ID |
| `externalUserId` | `string` | Yes | - | External user ID for Pipedream Connect |
| `onSelect` | `(items, configuredProps) => void` | Yes | - | Called with selected `FilePickerItem[]` and final `configuredProps` |
| `onCancel` | `() => void` | No | - | Called when user cancels |
| `initialConfiguredProps` | `Record<string, unknown>` | No | - | Restore a previous navigation state |
| `confirmText` | `string` | No | `"Select"` | Confirm button text |
| `cancelText` | `string` | No | `"Cancel"` | Cancel button text |
| `selectFolders` | `boolean` | No | `true` | Allow selecting folders |
| `selectFiles` | `boolean` | No | `true` | Allow selecting files |
| `multiSelect` | `boolean` | No | `false` | Allow selecting multiple items |
| `appConfig` | `FilePickerAppConfig` | No | - | Custom app config (overrides built-in) |
| `debug` | `boolean` | No | `false` | Enable debug logging to console |
| `showIcons` | `boolean` | No | `true` | Show icons next to items |
| `icons` | `FilePickerIcons` | No | SVG icons | Custom file/folder icons (used at the file level) |

## Modal Variant

`ConfigureFilePickerModal` wraps the picker in a modal dialog:

```tsx
<ConfigureFilePickerModal
  open={showPicker}
  title="Select SharePoint Files"
  componentKey="sharepoint_admin-retrieve-file-metadata"
  app="sharepoint_admin"
  accountId={connectedAccountId}
  externalUserId={userId}
  onSelect={(items, configuredProps) => handleSelection(items)}
  onCancel={() => setShowPicker(false)}
  multiSelect
/>
```

Additional modal props: `open` (boolean), `title` (string, default "Select Files").
