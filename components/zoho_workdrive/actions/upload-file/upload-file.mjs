import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import app from "../../zoho_workdrive.app.mjs";
import {
  additionalFolderProps, findMaxFolderId,
} from "../../common/additionalFolderProps.mjs";

export default {
  key: "zoho_workdrive-upload-file",
  name: "Upload File",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Upload a new file to your WorkDrive account. [See the documentation](https://workdrive.zoho.com/apidocs/v1/chunkupload/chunkuploadcreatesession)",
  type: "action",
  props: {
    app,
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    folderType: {
      propDefinition: [
        app,
        "folderType",
      ],
    },
    parentId: {
      propDefinition: [
        app,
        "parentId",
        ({
          teamId, folderType,
        }) => ({
          teamId,
          folderType,
        }),
      ],
      reloadProps: true,
    },
    filename: {
      label: "Filename",
      description: "The name of the file should be URL encoded with UTF-8 Charset.",
      type: "string",
      optional: true,
    },
    overrideNameExist: {
      type: "boolean",
      label: "Override Name Exist",
      description: "If set as **true**, a file with the matching name will be uploaded as a top version over the existing file. If set as **false**, a file with the matching name will have the timestamp added to it on upload.",
      optional: true,
    },
    content: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    return additionalFolderProps.call(this);
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.content);
    const data = new FormData();
    data.append("content", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    const override = this.overrideNameExist?.toString();

    const num = findMaxFolderId(this);
    const parentId = num > 0
      ? this[`folderId${num}`]
      : this.parentId;

    data.append("parent_id", parentId);
    if (this.filename) data.append("filename", this.filename);
    if (override) data.append("override-name-exist", override);

    const response = await this.app.uploadFile({
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });

    $.export("$summary", "The file was successfully uploaded!");
    return response;
  },
};
