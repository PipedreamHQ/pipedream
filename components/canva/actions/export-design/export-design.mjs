import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";
import fs from "fs";
import stream from "stream";
import util from "util";

export default {
  key: "canva-export-design",
  name: "Export Design",
  description: "Starts a new job to export a file from Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    designId: {
      propDefinition: [
        canva,
        "designId",
      ],
    },
    type: {
      type: "string",
      label: "Format Type",
      description: "The desired export format",
      options: constants.EXPORT_TYPES,
    },
    pages: {
      type: "integer[]",
      label: "Pages",
      description: "To specify which pages to export in a multi-page design, provide the page numbers as an array. The first page in a design is page `1`. If pages isn't specified, all the pages are exported.",
      optional: true,
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Applicable for JPG exports only. 1 (smallest file, most compressed) to 100 (best quality).",
      optional: true,
    },
    mp4Quality: {
      type: "string",
      label: "Video Quality",
      description: "Applicable for MP4 exports only. The orientation and resolution of the exported video.",
      options: constants.MP4_QUALITY,
      optional: true,
    },
    size: {
      type: "string",
      label: "Paper Size",
      description: "Applicable for PDF exports only. The paper size of the exported file.",
      options: constants.PAPER_SIZE,
      optional: true,
    },
    lossless: {
      type: "boolean",
      label: "Lossless",
      description: "Applicable for PNG exports only. When true, uses lossless compression.",
      optional: true,
    },
    asSingleImage: {
      type: "boolean",
      label: "As Single Image",
      description: "Applicable for PNG exports only. When true, merges multi-page designs into a single image.",
      optional: true,
    },
    exportQuality: {
      type: "string",
      label: "Export Quality",
      description: "Applicable for PDF, JPG, PNG, GIF, MP4 exports. Pro export may fail if design contains premium elements.",
      options: constants.EXPORT_QUALITY,
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Applicable for JPG, PNG, GIF exports only. Height in pixels of the exported image.",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Applicable for JPG, PNG, GIF exports only. Width in pixels of the exported image.",
      optional: true,
    },
    newFileName: {
      type: "string",
      label: "File Name",
      description: "The file name to save the exported file as under /tmp. Include the extension e.g. design.pdf",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },

  async run({ $ }) {
    let response = await this.canva.exportDesign({
      $,
      data: {
        design_id: this.designId,
        format: {
          type: this.type,
          pages: this.pages,
          quality: this.type === "mp4"
            ? this.mp4Quality
            : this.quality,
          export_quality: this.exportQuality,
          size: this.size,
          height: this.height,
          width: this.width,
          lossless: this.lossless,
          as_single_image: this.asSingleImage,
        },
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const exportId = response.job.id;
      const deadline = Date.now() + 2 * 60 * 1000;

      // FIX 1 — bounded polling loop
      while (response.job.status === "in_progress") {
        if (Date.now() >= deadline) {
          throw new Error(`Timed out waiting for export job "${exportId}" to complete`);
        }
        await timer(3000);
        response = await this.canva.getDesignExportJob({
          $,
          exportId,
        });
        if (response.job.error) {
          throw new Error(response.job.error.message);
        }
      }

      const urls = response.job.urls;
      if (!urls || urls.length === 0) {
        throw new Error("Export completed but no download URL was returned.");
      }

      const pipeline = util.promisify(stream.pipeline);
      const savedPaths = [];

      for (let i = 0; i < urls.length; i++) {
        const fileResponse = await fetch(urls[i]);
        const defaultName = `canva-export-${response.job.id}.${this.type}`;
        const baseName = (this.newFileName || defaultName).split("/").pop();
        const fileName = urls.length > 1
          ? `${baseName.replace(/\.[^.]+$/, "")}-${i + 1}${baseName.match(/\.[^.]+$/) || ""}`
          : baseName;
        const tmpFilePath = `/tmp/${fileName}`;
        await pipeline(fileResponse.body, fs.createWriteStream(tmpFilePath));
        savedPaths.push(tmpFilePath);
      }

      $.export("$summary", `Successfully exported design "${this.designId}" and saved to ${savedPaths.join(", ")}`);
      return savedPaths.length === 1
        ? savedPaths[0]
        : savedPaths;
    }

    $.export("$summary", `Successfully started export job for design "${this.designId}"`);
    return response;
  },
};
