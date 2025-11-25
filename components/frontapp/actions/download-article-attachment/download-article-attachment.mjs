import fs from "fs";
import path from "path";
import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-download-article-attachment",
  name: "Download Article Attachment",
  description: "Downloads the attachment from an article. [See the documentation](https://dev.frontapp.com/reference/download-attachment-from-an-article)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontapp,
    knowledgeBaseId: {
      propDefinition: [
        frontapp,
        "knowledgeBaseId",
      ],
    },
    articleId: {
      propDefinition: [
        frontapp,
        "articleId",
        ({ knowledgeBaseId }) => ({
          knowledgeBaseId,
        }),
      ],
    },
    attachmentId: {
      type: "string",
      label: "Attachment ID",
      description: "The ID of the file to download",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the file as in the `/tmp` directory",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.frontapp.downloadArticleAttachment({
      $,
      articleId: this.articleId,
      attachmentId: this.attachmentId,
      responseType: "arraybuffer",
    });

    // Extract filename from content-disposition header or use provided filename
    const contentDisposition = response.headers["content-disposition"];
    const headerFileName = contentDisposition?.match(/filename\*?=(?:UTF-8'')?([^;]+)/)?.[1]?.replace(/['"]/g, "");
    const fileName = this.filename || headerFileName || this.attachmentId;
    const filePath = path.join("/tmp", fileName);

    // The response.data contains the binary content of the attachment file
    const buffer = Buffer.isBuffer(response.data)
      ? response.data
      : Buffer.from(response.data);
    fs.writeFileSync(filePath, buffer);

    // Get file size from content-length header or buffer
    const fileSize = response.headers["content-length"] || buffer.length;

    $.export("$summary", `Successfully downloaded attachment: ${fileName} (${fileSize} bytes)`);

    return filePath;
  },
};
