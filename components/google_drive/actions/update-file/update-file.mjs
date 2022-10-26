import googleDrive from "../../google_drive.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";
import { getFileStream } from "../../common/utils.mjs";

export default {
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content. [See the docs](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "0.0.5",
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
      description: toSingleLineString(`
        The path to the file saved to the [\`/tmp\`
        directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)
        (e.g., \`/tmp/myFile.csv\`) with which to update content
      `),
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
      label: "Advanced Options",
      optional: true,
      description: toSingleLineString(`
        Specify less-common properties that you want to use. See [Files: update]
        (https://developers.google.com/drive/api/v3/reference/files/update#request-body) for a list
        of supported properties.
      `),
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
