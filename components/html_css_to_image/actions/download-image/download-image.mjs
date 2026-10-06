import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import htmlCssToImageApp from "../../html_css_to_image.app.mjs";
import {
  validateDownloadInput,
  getDownloadFileName,
} from "../../common/files.mjs";

export default {
  key: "html_css_to_image-download-image",
  name: "Download Image",
  description: "Download an image or PDF to the workflow's /tmp directory and return its filePath, fileName, contentType, and size in bytes for later upload or attachment steps. Use the url returned by **Create Image From HTML**, **Create Image From URL**, **Create Image From Template**, **Generate Signed URL for Template**, or **Generate Signed URL for Webpage**. Downloading a signed URL requests rendering and may consume image credits. API credentials are not sent to the download URL. [See the documentation](https://docs.htmlcsstoimage.com/getting-started/create-and-render/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    htmlCssToImageApp,
    imageUrl: {
      type: "string",
      label: "Image URL",
      format: "file-ref",
      description: "Complete image or PDF URL hosted on `hcti.io`, e.g. `https://hcti.io/v1/image/c7db3b3c-59b3-4c13-987b-4ea8217899cf.png`. Use the `url` returned by **Create Image From HTML**, **Create Image From URL**, **Create Image From Template**, **Generate Signed URL for Template**, or **Generate Signed URL for Webpage**. Downloading a signed URL triggers rendering; pass it unchanged. Other hosts, custom ports, and redirects to other hosts are rejected.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Filename for the downloaded file, e.g. `invoice.pdf`. Supply a filename without a directory path. Omit to generate a unique name with an extension inferred from the response or URL.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    validateDownloadInput(this.imageUrl, this.fileName);
    const response = await this.htmlCssToImageApp.downloadImage($, this.imageUrl);
    const contentType = response.headers["content-type"]?.split(";")[0].trim();
    const fileName = getDownloadFileName(this.imageUrl, contentType, this.fileName);
    let directory;
    try {
      directory = await fs.promises.mkdtemp("/tmp/hcti-download-");
      const filePath = path.join(directory, fileName);
      await pipeline(response.data, fs.createWriteStream(filePath));
      const { size } = await fs.promises.stat(filePath);
      $.export("$summary", `Downloaded ${fileName} (${size} bytes). Image rendering was requested if the URL is signed.`);
      return {
        filePath,
        fileName,
        contentType,
        size,
      };
    } catch (error) {
      response.data.destroy();
      if (directory) await fs.promises.rm(directory, {
        recursive: true,
        force: true,
      });
      throw error;
    }
  },
};
