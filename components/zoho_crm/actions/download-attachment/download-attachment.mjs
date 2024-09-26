import fs from "fs";
import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment file from Zoho CRM, saves it in the temporary file system and exports the file path for use in a future step.",
  version: "0.2.1",
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
    attachmentId: {
      propDefinition: [
        zohoCrm,
        "attachmentId",
        (c) => ({
          module: c.module,
          recordId: c.recordId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const file = await this.zohoCrm.downloadAttachment(
      this.module,
      this.recordId,
      this.attachmentId,
      $,
    );

    const filePath = "/tmp/" + this.attachmentId;
    fs.writeFileSync(filePath, file);

    $.export("$summary", "Successfully downloaded attachment");
    $.export("file_path", filePath);
    return file;
  },
};
