import fs from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../pixelbin.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pixelbin-upload-file",
  name: "Upload File",
  description: "Upload a file to Pixelbin. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "Assete file path. The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
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
  },
  methods: {
    uploadFile(args = {}) {
      return this.app.post({
        path: "/upload/direct",
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

    if (!filePath.startsWith("/tmp/")) {
      throw new ConfigurationError("File must be located in `/tmp` directory.");
    }

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

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
    });

    $.export("$summary", `Successfully uploaded file with ID \`${response._id}\`.`);
    return response;
  },
};
