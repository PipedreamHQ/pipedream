import googleDrive from "../../google_drive.app.mjs";
import fs from "fs";
import got from "got";
import { toSingleLineString } from "../../utils.mjs";

export default {
  key: "google_drive-create-file",
  name: "Create a New File",
  description: "Create a new file from a URL or /tmp/filepath. [See the docs](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.0.8",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
    },
    parent: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      label: "Parent Folder",
      description: toSingleLineString(`
        The ID of the parent folder which contains the file. If not specified, the file will be
        placed directly in the drive's top-level folder.
    `),
      optional: true,
    },
    uploadType: {
      propDefinition: [
        googleDrive,
        "uploadType",
      ],
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
    },
    ignoreDefaultVisibility: {
      type: "boolean",
      label: "Ignore Default Visibility",
      description: toSingleLineString(`
        Whether to ignore the domain's default visibility settings for the created 
        file. Domain administrators can choose to make all uploaded files visible to the domain 
        by default; this parameter bypasses that behavior for the request. Permissions are still 
        inherited from parent folders.
      `),
      default: false,
    },
    includePermissionsForView: {
      type: "string",
      label: "Include Permissions For View",
      description: toSingleLineString(`
        Specifies which additional view's permissions to include in the response. Only 
        'published' is supported.
      `),
      optional: true,
      options: [
        "published",
      ],
    },
    keepRevisionForever: {
      propDefinition: [
        googleDrive,
        "keepRevisionForever",
      ],
      default: false,
    },
    ocrLanguage: {
      propDefinition: [
        googleDrive,
        "ocrLanguage",
      ],
    },
    useContentAsIndexableText: {
      propDefinition: [
        googleDrive,
        "useContentAsIndexableText",
      ],
      default: false,
    },
    supportsAllDrives: {
      type: "boolean",
      label: "Supports All Drives",
      description: toSingleLineString(`
        Whether to include shared drives. Set to 'true' if saving to a shared drive.
        Defaults to 'false' if left blank.
      `),
      optional: true,
    },
    contentHintsIndexableText: {
      type: "string",
      label: "Content Hints Indexable Text",
      description: toSingleLineString(`
        Text to be indexed for the file to improve fullText queries. This is limited to 128KB in
        length and may contain HTML elements.
      `),
      optional: true,
    },
    contentRestrictionsReadOnly: {
      type: "boolean",
      label: "Content Restrictions Read Only",
      description: toSingleLineString(`
        Whether the content of the file is read-only. If a file is read-only, a new revision of 
        the file may not be added, comments may not be added or modified, and the title of the file 
        may not be modified.
      `),
      optional: true,
    },
    contentRestrictionsReason: {
      type: "string",
      label: "Content Restrictions Reason",
      description: toSingleLineString(`
        Reason for why the content of the file is restricted. This is only mutable on requests 
        that also set readOnly=true.
      `),
      optional: true,
    },
    copyRequiresWriterPermission: {
      type: "boolean",
      label: "Copy Requires Writer Permission",
      description: toSingleLineString(`
        Whether the options to copy, print, or download this file, should be disabled for 
        readers and commentators
      `),
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short description of the file",
      optional: true,
    },
    folderColorRgb: {
      type: "string",
      label: "Folder Color RGB",
      description: toSingleLineString(`
        The color for a folder as an RGB hex string. If an unsupported color is specified,
        the closest color in the palette will be used instead.
      `),
      optional: true,
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description: "Name of the file",
    },
    originalFilename: {
      type: "string",
      label: "Original Filename",
      description:
        "The original filename of the uploaded content if available, or else the original value of the name field. This is only available for files with binary content in Google Drive.",
      optional: true,
    },
    shortcutDetailsTargetId: {
      type: "string",
      label: "Shortcut Details Target ID",
      description: "The ID of the file that this shortcut points to",
      optional: true,
    },
    starred: {
      type: "boolean",
      label: "Starred",
      description: "Whether the user has starred the file",
      optional: true,
    },
    writersCanShare: {
      type: "boolean",
      label: "Writers Can Share",
      description:
        "Whether users with only writer permission can modify the file's permissions. Not populated for items in shared drives.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = this.fileUrl
      ? await got.stream(this.fileUrl)
      : fs.createReadStream(this.filePath);
    const driveId = this.googleDrive.getDriveId(this.drive);
    const resp = await this.googleDrive.createFile({
      ignoreDefaultVisibility: this.ignoreDefaultVisibility,
      includePermissionsForView: this.includePermissionsForView,
      keepRevisionForever: this.keepRevisionForever,
      ocrLanguage: this.ocrLanguage,
      useContentAsIndexableText: this.useContentAsIndexableText,
      supportsAllDrives: this.supportsAllDrives,
      resource: {
        name: this.name,
        originalFilename: this.originalFilename,
        parents: [
          this.parent ?? driveId,
        ],
        mimeType: this.mimeType,
        description: this.description,
        folderColorRgb: this.folderColorRgb,
        shortcutDetails: {
          targetId: this.shortcutDetailsTargetId,
        },
        starred: this.starred,
        writersCanShare: this.writersCanShare,
        contentHints: {
          indexableText: this.contentHintsIndexableText,
        },
        contentRestrictions: {
          readOnly: this.contentRestrictionsReadOnly,
          reason: this.contentRestrictionsReason,
        },
        copyRequiresWriterPermission: this.copyRequiresWriterPermission,
      },
      media: {
        mimeType: this.mimeType,
        uploadType: this.uploadType,
        body,
      },
      fields: "*",
    });
    $.export("$summary", `Successfully created a new file, "${resp.name}"`);
    return resp;
  },
};
