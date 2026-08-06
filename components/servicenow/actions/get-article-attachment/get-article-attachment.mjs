import fs from "fs";
import path from "path";
import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-article-attachment",
  name: "Get Article Attachment",
  description: "Download an attachment from a knowledge article to the `/tmp` directory. Run **Get Article** first: its `attachments` array holds each attachment's `sys_id` and `file_name`, but only when the article record has `display_attachments` enabled. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    articleSysId: {
      type: "string",
      label: "Article Sys ID",
      description: "The `sys_id` of the article the attachment belongs to. Example: `0b48fd75474321009db4b5b08b9a71c2`.",
    },
    attachmentSysId: {
      type: "string",
      label: "Attachment Sys ID",
      description: "The `sys_id` of the attachment to download, from the `attachments` array returned by **Get Article**. Example: `fedf5614294f4010f877796e70786956`.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Name to save the file as in `/tmp`, including the extension. Defaults to the attachment's `sys_id`. Example: `vpn-setup-guide.pdf`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const content = await this.servicenow.getKnowledgeArticleAttachment({
      $,
      articleSysId: this.articleSysId,
      attachmentSysId: this.attachmentSysId,
    });

    const requestedName = path.basename(this.fileName || "");
    const isUnsafeName = !requestedName || requestedName === "." || requestedName === "..";
    const filePath = path.join("/tmp", isUnsafeName
      ? this.attachmentSysId
      : requestedName);
    await fs.promises.writeFile(filePath, content);

    $.export("$summary", `Successfully downloaded attachment to \`${filePath}\``);

    return {
      filePath,
      sizeBytes: content.length,
    };
  },
};
