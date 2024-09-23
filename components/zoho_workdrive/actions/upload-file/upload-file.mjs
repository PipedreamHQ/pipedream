import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import { getFilePath } from "../../common/utils.mjs";
import app from "../../zoho_workdrive.app.mjs";

export default {
  key: "zoho_workdrive-upload-file",
  name: "Upload File",
  version: "0.0.3",
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
      label: "File Path",
      description: "Full path to the file in `/tmp/` directory. E.g. `/tmp/file.jpg`",
      type: "string",
    },
  },
  async run({ $ }) {
    const path = getFilePath(this.content);
    if (!fs.existsSync(path)) {
      throw new ConfigurationError("File does not exist!");
    }
    const file = fs.createReadStream(path);
    const data = new FormData();
    const override = this.overrideNameExist?.toString();

    data.append("content", file);
    data.append("parent_id", this.parentId);
    if (this.filename)data.append("filename", this.filename);
    if (override)data.append("override-name-exist", override);

    const response = await this.app.uploadFile({
      $,
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });

    $.export("$summary", "The file was successfully uploaded!");
    return response;
  },
};
