import zohoCrm from "../../zoho_crm.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "zoho_crm-upload-attachment",
  name: "Upload Attachment",
  description: "Uploads an attachment file to Zoho CRM from a URL or file path. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v3/upload-attachment.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoCrm,
    module: {
      propDefinition: [
        zohoCrm,
        "module",
      ],
    },
    recordId: {
      propDefinition: [
        zohoCrm,
        "recordId",
        (c) => ({
          module: c.module,
        }),
      ],
    },
    url: {
      type: "string",
      label: "File URL",
      description: "Source URL of the file to fetch and upload",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
      optional: true,
    },
  },
  methods: {
    formatFilePath(path) {
      if (path.includes("/tmp/")) {
        return path;
      }
      return `/tmp/${path}`;
    },
  },
  async run({ $ }) {
    if (!this.url && !this.filePath) {
      throw new ConfigurationError("Either File URL or File Path must be entered.");
    }

    let data = new FormData();

    if (this.filePath) {
      const file = fs.createReadStream(this.formatFilePath(this.filePath));
      data.append("file", file);
    } else {
      data.append("attachmentUrl", this.url);
    }

    const response = await this.zohoCrm.uploadAttachment(this.module, this.recordId, data, $);

    if (response) {
      $.export("$summary", `Successfully uploaded a file with ID ${response.data[0].details.id} to the project.`);
    }

    return response;
  },
};
