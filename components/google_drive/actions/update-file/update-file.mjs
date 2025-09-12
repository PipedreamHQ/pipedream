import { getFileStream } from "@pipedream/platform";
import { toSingleLineString } from "../../common/utils.mjs";
import googleDrive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "2.0.5",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
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
    filePath: {
      propDefinition: [
        googleDrive,
        "filePath",
      ],
      optional: true,
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
      propDefinition: [
        googleDrive,
        "folderId",
      ],
      type: "string[]",
      label: "Add Parents",
      description: "A list of parent folder IDs to add",
      optional: true,
    },
    removeParents: {
      propDefinition: [
        googleDrive,
        "fileParents",
        ({ fileId }) => ({
          fileId,
        }),
      ],
      label: "Remove Parents",
      description: "A list of parent folder IDs to remove",
    },
    keepRevisionForever: {
      propDefinition: [
        googleDrive,
        "keepRevisionForever",
      ],
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
    },
    advanced: {
      type: "object",
      label: "Additional Options",
      optional: true,
      description: toSingleLineString(`
        Any additional parameters to pass in the request. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update#request-body) for all available parameters.
      `),
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileId,
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

    // Update file content, if set, separately from metadata to prevent
    // multipart upload, which `google-apis-nodejs-client` doesn't seem to
    // support for [files.update](https://bit.ly/3lP5sWn)
    if (filePath) {
      const fileStream = await getFileStream(filePath);
      await this.googleDrive.updateFileMedia(fileId, fileStream, {
        mimeType,
      });
    }

    const resp = await this.googleDrive.updateFile(fileId, {
      name,
      mimeType,
      addParents: addParents?.join(","),
      removeParents: removeParents?.join(","),
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
