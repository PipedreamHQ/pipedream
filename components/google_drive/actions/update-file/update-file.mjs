import googleDrive from "../../google_drive.app.mjs";
import {
  toSingleLineString,
  getFileStream,
} from "../../common/utils.mjs";
import { additionalProps } from "../../common/filePathOrUrl.mjs";

export default {
  key: "google_drive-update-file",
  name: "Update File",
  description: "Update a file's metadata and/or content. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/update) for more information",
  version: "1.0.0",
  type: "action",
  additionalProps,
  props: {
    googleDrive,
    updateType: {
      type: "string",
      label: "Update Type",
      description: "Whether to update content or metadata only",
      options: [
        {
          label: "Upload content from File URL",
          value: "File URL",
        },
        {
          label: "Upload content from File Path",
          value: "File Path",
        },
        {
          label: "Update file metadata only",
          value: "File Metadata",
        },
      ],
      reloadProps: true,
    },
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
      optional: false,
      hidden: true,
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
      optional: false,
      hidden: true,
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
      updateType,
    } = this;

    let fileStream;
    if (updateType === "File URL") {
      fileStream = await getFileStream({
        $,
        fileUrl,
      });
    } else if (updateType === "File Path") {
      fileStream = await getFileStream({
        $,
        filePath,
      });
    }

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
