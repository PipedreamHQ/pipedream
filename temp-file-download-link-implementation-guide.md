# Instructions for Adding Temporary Download Links to Source Components

## Overview
This feature allows users to receive temporary download links to files emitted in events by uploading them to Pipedream's File Stash. The implementation requires three main changes:

1. **App-level method**: Add a `downloadFile` method in the app file
2. **Component props**: Add `includeLink` and `dir` props to the source component  
3. **Component methods**: Add `stashFile` method and override the `emitEvents` method

## Step-by-Step Implementation

### 1. App File Changes (`app.mjs`)

Add a `downloadFile` method that downloads file content as a buffer:

```javascript
downloadFile({
  // App-specific parameters for file identification
  folderPath, filename, ...opts  // Example from egnyte
}) {
  return this._makeRequest({
    path: `/path/to/file/endpoint`,  // App-specific API endpoint
    responseType: "arraybuffer",     // Critical: must return binary data
    ...opts,
  });
}
```

**Key Requirements:**
- Must return binary data (`responseType: "arraybuffer"`)
- Should accept parameters needed to uniquely identify the file
- Use the app's existing `_makeRequest` or equivalent method

### 2. Component Props

Add two new props to the source component:

```javascript
props: {
  ...common.props,  // or existing props
  includeLink: {
    label: "Include Link",
    type: "boolean", 
    description: "If true, the document will be uploaded to your File Stash and a temporary download link to the file will be emitted. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
    default: false,
    optional: true,
  },
  dir: {
    type: "dir",
    accessMode: "write", 
    optional: true,
  },
}
```

### 3. Required Imports

Add these imports at the top of the component file:

```javascript
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";
```

### 4. Component Methods

#### Add `stashFile` Method

```javascript
async stashFile(item) {
  // Download the file using the app's downloadFile method
  const response = await this.appName.downloadFile({
    // Pass parameters needed to identify the file
    // This varies by app - examples:
    folderPath: this.folderPath,  // egnyte example
    filename: item.name,          // egnyte example
    // OR
    // Bucket: item.bucket.name,     // aws example  
    // Key: item.object.key,         // aws example
  });
  
  // Convert response to buffer
  const buffer = Buffer.from(response);
  
  // Create unique filepath (customize based on your data structure)
  const filepath = `${item.entry_id}/${item.name}`;  // egnyte example
  // OR
  // const filepath = `${item.bucket.name}/${item.object.key}`;  // aws example
  
  // Detect file type
  const type = await fileTypeFromBuffer(buffer);
  
  // Upload to File Stash
  const file = await this.dir.open(filepath).fromReadableStream(
    Readable.from(buffer),
    type?.mime,
    buffer.length,
  );
  
  // Return file with temporary download link
  return await file.withoutPutUrl().withGetUrl();
}
```

#### Override `emitEvents` Method

```javascript
async emitEvents(items) {
  for (const item of items) {
    if (this.includeLink) {
      item.file = await this.stashFile(item);
    }
    const meta = this.generateMeta(item);
    this.$emit(item, meta);
  }
}
```

**Important Notes:**
- This method overrides the one from the common base file
- It processes items sequentially to handle file downloads properly
- The `item.file` property will contain: `{ path, get_url, s3Key, type }`

## App-Specific Considerations

### File Identification Parameters
Different apps require different parameters to identify and download files:

- **Egnyte**: `folderPath` + `filename`
- **AWS S3**: `Bucket` + `Key` 
- **Box**: File ID
- **Google Drive**: File ID

### Filepath Generation
Create unique filepaths based on available data:

- **Egnyte**: `${item.entry_id}/${item.name}`
- **AWS**: `${item.bucket.name}/${item.object.key}`
- **Box**: `${item.id}/${item.name}`

### Buffer Handling
Most apps can use `Buffer.from(response)`, but some may need special handling:

- **AWS S3**: May need to convert stream to buffer first
- **APIs returning streams**: Use helper method to convert stream to buffer

## Testing Checklist

- [ ] Component loads without errors when `includeLink` is false
- [ ] Component loads without errors when `includeLink` is true  
- [ ] Files are properly downloaded and uploaded to File Stash
- [ ] Temporary download links are included in emitted events
- [ ] File type detection works correctly
- [ ] Unique filepaths prevent collisions

## Common Patterns for Reference

Look at these existing implementations for guidance:
- `components/egnyte/sources/new-file-in-folder/new-file-in-folder.mjs`
- `components/aws/sources/common/include-link.mjs`
- `components/box/sources/new-file/new-file.mjs`

## Example Implementation (Egnyte)

Here's the complete implementation from the Egnyte component for reference:

### App File Addition
```javascript
downloadFile({
  folderPath, filename, ...opts
}) {
  return this._makeRequest({
    path: `/fs-content/${folderPath}/${filename}`,
    responseType: "arraybuffer",
    ...opts,
  });
}
```

### Component Implementation
```javascript
import common from "../common/base.mjs";
import { Readable } from "stream";
import { fileTypeFromBuffer } from "file-type";

export default {
  ...common,
  props: {
    ...common.props,
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload attachment to your File Stash and emit temporary download link to the file. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async stashFile(item) {
      const response = await this.egnyte.downloadFile({
        folderPath: this.folderPath,
        filename: item.name,
      });
      const buffer = Buffer.from(response);
      const filepath = `${item.entry_id}/${item.name}`;
      const type = await fileTypeFromBuffer(buffer);
      const file = await this.dir.open(filepath).fromReadableStream(
        Readable.from(buffer),
        type?.mime,
        buffer.length,
      );
      return await file.withoutPutUrl().withGetUrl();
    },
    async emitEvents(items) {
      for (const item of items) {
        if (this.includeLink) {
          item.file = await this.stashFile(item);
        }
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
  },
};
```

This pattern provides a consistent way to add file download functionality across all Pipedream source components that emit file events.
