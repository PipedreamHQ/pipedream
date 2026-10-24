import fastaf from "../../fastaf.app.mjs";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export default {
  key: "fastaf-screenshot",
  name: "Capture Screenshot",
  description: "Capture a public page and save the image to a temporary file for later steps. Costs 5 credits. [Documentation](https://fastaf.co/docs/#screenshot)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    url: {
      propDefinition: [
        fastaf,
        "url",
      ],
      description: "Public HTTP(S) page to capture; private targets and login paths are refused. [Documentation](https://fastaf.co/docs/#screenshot)",
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the entire scrollable page instead of only the viewport. Default false; no extra credits. [Documentation](https://fastaf.co/docs/#screenshot)",
      default: false,
      optional: true,
    },
    width: {
      type: "integer",
      label: "Viewport Width",
      description: "Browser viewport width in CSS pixels, for example `1280`. Leave unset for the service default. [Documentation](https://fastaf.co/docs/#screenshot)",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Viewport Height",
      description: "Browser viewport height in CSS pixels, for example `720`. Leave unset for the service default. [Documentation](https://fastaf.co/docs/#screenshot)",
      optional: true,
    },
    format: {
      type: "string",
      label: "Image Format",
      description: "Image encoding: PNG (default), JPG or WebP. [Documentation](https://fastaf.co/docs/#screenshot)",
      options: [
        "png",
        "jpg",
        "webp",
      ],
      default: "png",
      optional: true,
    },
    quality: {
      type: "integer",
      label: "Image Quality",
      description: "Lossy image quality from 0 to 100; default 80. Applies to JPG/WebP, not lossless PNG. [Documentation](https://fastaf.co/docs/#screenshot)",
      default: 80,
      optional: true,
    },
    waitUntil: {
      type: "string",
      label: "Wait Until",
      description: "Navigation readiness: DOM parsed (default), full load, or idle network. [Documentation](https://fastaf.co/docs/#screenshot)",
      options: [
        "domcontentloaded",
        "load",
        "networkidle",
      ],
      default: "domcontentloaded",
      optional: true,
    },
    dir: {
      type: "dir",
      label: "Output Directory",
      description: "Sync the returned temporary screenshot file with Pipedream File Stash when running via Connect.",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const format = this.format || "png";
    if (![
      "png",
      "jpg",
      "webp",
    ].includes(format)) throw new Error("Unsupported image format.");
    const response = await this.fastaf.screenshot({
      $,
      data: {
        url: this.url,
        fullPage: this.fullPage,
        width: this.width === undefined
          ? undefined
          : String(this.width),
        height: this.height === undefined
          ? undefined
          : String(this.height),
        format,
        quality: this.quality,
        wait_until: this.waitUntil,
      },
    });
    const filePath = join(tmpdir(), `fastaf-${randomUUID()}.${format}`);
    const image = Buffer.from(response.data);
    await writeFile(filePath, image);
    $.export("$summary", "Successfully saved one screenshot to a temporary file.");
    return {
      filePath,
      contentType: response.headers["content-type"],
      bytes: image.length,
    };
  },
};
