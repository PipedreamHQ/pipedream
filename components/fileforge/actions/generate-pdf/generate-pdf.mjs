import FormData from "form-data";
import fs from "fs";
import {
  checkTmp,
  parseObject,
} from "../../common/utils.mjs";
import fileforge from "../../fileforge.app.mjs";

export default {
  key: "fileforge-generate-pdf",
  name: "Generate PDF",
  description: "Generate a PDF from provided HTML. [See the documentation](https://docs.fileforge.com/api-reference/api-reference/pdf/generate)",
  version: "0.0.1",
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
      label: "HTML Files",
      description: "The HTML files to convert to PDF. Each file should be a valid path to an HTML file saved to the `/tmp` directory (e.g. `/tmp/image.png`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)..",
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
      formData.append("files", fs.createReadStream(checkTmp(file)));
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
