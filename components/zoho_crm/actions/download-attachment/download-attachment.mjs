import fs from "fs";
import zohoCrm from "../../zoho_crm.app.mjs";

export default {
  key: "zoho_crm-download-attachment",
  name: "Download Attachment",
  description: "Downloads an attachment file from Zoho CRM, saves it in the temporary file system and exports the file path for use in a future step.",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    // This prop indicates that the otherwise ephemeral /tmp directory is automatically synced to a
    // remote directory (if configured for the execution context), making files written by this
    // action accessible for future executions.  Only files located in STASH_DIR or, for legacy
    // action support, whose /tmp file paths are explicitly returned by `run` will be synced.
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const file = await this.zohoCrm.downloadAttachment(
      this.module,
      this.recordId,
      this.attachmentId,
      $,
    );

    const filePath = (process.env.STASH_DIR || "/tmp") + "/" + this.attachmentId;
    fs.writeFileSync(filePath, file);

    $.export("$summary", "Successfully downloaded attachment");
    $.export("file_path", filePath);
    return file;
  },
};
