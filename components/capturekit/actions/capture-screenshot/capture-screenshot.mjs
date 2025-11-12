import app from "../../capturekit.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "capturekit-capture-screenshot",
  name: "Capture Screenshot",
  description: "Capture a high-quality image of any webpage. [See the documentation](https://docs.capturekit.dev/api-reference/screenshot-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
    device: {
      propDefinition: [
        app,
        "device",
      ],
    },
    cache: {
      propDefinition: [
        app,
        "cache",
      ],
    },
    fullPageScroll: {
      propDefinition: [
        app,
        "fullPageScroll",
      ],
    },
    fileName: {
      propDefinition: [
        app,
        "fileName",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.captureScreenshot({
      $,
      params: {
        url: this.url,
        format: this.format,
        device: this.device,
        cache: this.cache,
        full_page_scroll: this.fullPageScroll,
      },
      responseType: "arraybuffer",
    });

    const fileExtension = this.format || "png";
    const fileName = `${this.fileName}.${fileExtension}`;
    const filePath = path.join("/tmp", fileName);

    await fs.promises.writeFile(filePath, response);

    $.export("$summary", `Screenshot successfully saved to: ${filePath}`);

    return filePath;
  },
};
