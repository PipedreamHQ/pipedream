import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../pixelbin.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pixelbin-upload-file",
  name: "Upload File",
  description: "Upload a file to Pixelbin. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    path: {
      propDefinition: [
        app,
        "path",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    access: {
      propDefinition: [
        app,
        "access",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    overwrite: {
      propDefinition: [
        app,
        "overwrite",
      ],
    },
    filenameOverride: {
      propDefinition: [
        app,
        "filenameOverride",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    uploadFile(args = {}) {
      return this.app.post({
        path: "/upload/direct",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadFile,
      filePath,
      path,
      name,
      access,
      tags,
      metadata,
      overwrite,
      filenameOverride,
    } = this;

    const {
      stream, metadata: fileMetadata,
    } = await getFileStreamAndMetadata(filePath);
    const data = new FormData();
    data.append("file", stream, {
      contentType: fileMetadata.contentType,
      knownLength: fileMetadata.size,
      filename: fileMetadata.name,
    });

    utils.appendPropsToFormData(data, {
      path,
      name,
      access,
      tags,
      metadata,
      overwrite,
      filenameOverride,
    });

    const response = await uploadFile({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file with ID \`${response._id}\`.`);
    return response;
  },
};
