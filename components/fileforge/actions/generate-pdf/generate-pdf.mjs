import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import fileforge from "../../fileforge.app.mjs";

export default {
  key: "fileforge-generate-pdf",
  name: "Generate PDF",
  description: "Generate a PDF from provided HTML. [See the documentation](https://docs.fileforge.com/api-reference/api-reference/pdf/generate)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fileforge,
    alert: {
      type: "alert",
      alertType: "warning",
      content: `An **\`index.html\`** file is required, and will be used as the main document.
      Other documents may also be attached, such as stylesheets or images.
      The path in the **\`filename\`** part of the multipart attachement will be respected during generation.
      **Important notice:** during generation, the **\`index.html\`** file will be processed to include the base URL of the document.
      This is required for assets to be loaded correctly.
      To link your assets from the HTML file, you should not use a leading slash in the URL.
      For example, use **\`<img src="image.jpg" />\`** instead of **\`<img src="/image.jpg" />\`**.`,
    },
    files: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "The HTML files to convert to PDF. For each entry, provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Generate a test document instead of a production document. The generated document will contain a watermark. Defaults to true.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "The expiration timestamp for the PDF in ISO 8601 format",
      optional: true,
    },
    fileName: {
      type: "string",
      label: "Filename",
      description: "The desired filename for the generated PDF.",
      optional: true,
    },
    allowViewing: {
      type: "boolean",
      label: "Allow Viewing",
      description: "Specifies whether viewing is allowed.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fileforge,
      files,
      ...data
    } = this;

    const formData = new FormData();
    const parsedFiles = parseObject(files);

    for (const file of parsedFiles) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      formData.append("files", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }

    formData.append("options", JSON.stringify({
      ...data,
      host: true,
    }), {
      contentType: "application/json",
    });

    const response = await fileforge.generatePDF({
      $,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", "Successfully generated the PDF file.");
    return response;
  },
};
