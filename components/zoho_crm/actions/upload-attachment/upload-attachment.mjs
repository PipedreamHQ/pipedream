import zohoCrm from "../../zoho_crm.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "zoho_crm-upload-attachment",
  name: "Upload Attachment",
  description: "Uploads an attachment file to Zoho CRM from a URL or file path. [See the documentation](https://www.zoho.com/crm/developer/docs/api/v3/upload-attachment.html)",
  version: "0.1.0",
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
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
  },
  async run({ $ }) {
    const data = new FormData();

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.zohoCrm.uploadAttachment(this.module, this.recordId, data, $);

    if (response) {
      $.export("$summary", `Successfully uploaded a file with ID ${response.data[0].details.id} to the project.`);
    }

    return response;
  },
};
