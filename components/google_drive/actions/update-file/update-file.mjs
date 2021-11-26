import googleDrive from "../../google_drive.app.mjs";
import { getFileStream } from "../../utils.mjs";
import isoLanguages from "../language-codes.mjs";

export default {
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content. [See the docs](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description:
        "The drive to use. If not specified, your personal Google Drive will be used. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
      optional: true,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description: "The file to update",
    },
    fileUrl: {
      propDefinition: [
        googleDrive,
        "fileUrl",
      ],
      description: "The URL of the file to use to update content",
    },
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      description:
        "The path to the file to saved to the /tmp (e.g., `/tmp/myFile.csv`) with which to update content",
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description: "The new name of the file",
    },
    mimeType: {
      propDefinition: [
        googleDrive,
        "mimeType",
      ],
      description:
        "The file's MIME type (e.g., `image/jpeg`). The value cannot be changed unless a new revision is uploaded.",
    },
    addParents: {
      type: "string",
      label: "Add Parents",
      description: "A comma-separated list of parent folder IDs to add",
      optional: true,
    },
    removeParents: {
      type: "string",
      label: "Remove Parents",
      description: "A comma-separated list of parent folder IDs to remove",
      optional: true,
    },
    keepRevisionForever: {
      type: "boolean",
      label: "Keep Revision Forever",
      description:
        "Whether to set the `keepForever` field in the new head revision",
      optional: true,
    },
    ocrLanguage: {
      type: "string",
      label: "OCR Language",
      description:
        "A language hint for OCR processing during image import (ISO 639-1 code)",
      optional: true,
      options: isoLanguages,
    },
    useContentAsIndexableText: {
      type: "boolean",
      label: "Use Content As Indexable Text",
      description: "Whether to use the uploaded content as indexable text",
      optional: true,
    },
    advanced: {
      type: "object",
      label: "Advanced Options",
      optional: true,
      description:
        "Specify less-common properties that you want to use. See [Files: update]" +
        "(https://developers.google.com/drive/api/v3/reference/files/update#request-body) for a list of supported properties.",
    },
  },
  async run({ $ }) {
    const {
      fileId,
      fileUrl,
      filePath,
      name,
      mimeType,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      advanced,
    } = this;

    const fileStream =
      fileUrl || filePath
        ? await getFileStream({
          $,
          fileUrl,
          filePath,
        })
        : undefined;

    // Update file content, if set, separately from metadata to prevent
    // multipart upload, which `google-apis-nodejs-client` doesn't seem to
    // support for [files.update](https://bit.ly/3lP5sWn)
    if (fileStream) {
      await this.googleDrive.updateFileMedia(fileId, fileStream, {
        mimeType,
      });
    }

    const resp = await this.googleDrive.updateFile(fileId, {
      name,
      mimeType,
      addParents,
      removeParents,
      keepRevisionForever,
      ocrLanguage,
      useContentAsIndexableText,
      requestBody: {
        ...advanced,
      },
      fields: "*",
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully updated the file, "${name ? resp.id : resp.name}"`);
    return resp;
  },
};
