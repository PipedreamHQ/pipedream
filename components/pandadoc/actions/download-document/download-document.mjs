import app from "../../pandadoc.app.mjs";
import fs from "fs";

export default {
  key: "pandadoc-download-document",
  name: "Download Document",
  description:
    "Download a document as PDF. [See documentation here](https://developers.pandadoc.com/reference/download-document)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    showWatermark: {
      type: "boolean",
      label: "Apply Watermark",
      description: "Set to true to show available watermark props",
      reloadProps: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "The filename of the downloaded document in the `tmp` folder.",
      optional: true,
      default: "document.pdf",
    },
    separateFiles: {
      type: "boolean",
      label: "Separate Files",
      description: "Download document bundle as a zip-archive of separate PDFs (1 file per section)",
      optional: true,
    },
  },
  methods: {
    downloadDocument({
      id, ...args
    }) {
      return this.app.makeRequest({
        path: `/documents/${id}/download`,
        responseType: "arraybuffer",
        ...args,
      });
    },
  },
  additionalProps() {
    return this.showWatermark
      ? {
        watermarkText: {
          type: "string",
          label: "Watermark Text",
          description: "Specify watermark text",
          optional: true,
        },
        watermarkColor: {
          type: "string",
          label: "Watermark Color",
          description: "Should be a HEX code `#RRGGBB`",
          optional: true,
        },
        watermarkFontSize: {
          type: "integer",
          label: "Watermark Font Size",
          description: "Font size of the watermark - positive integer",
          optional: true,
        },
        watermarkOpacity: {
          type: "string",
          label: "Watermark Opacity",
          description: "Should be in range 0.0 - 1.0",
          optional: true,
        },
      }
      : {};
  },
  async run({ $ }) {
    const {
      outputFilename, id,
    } = this;
    const data = await this.downloadDocument({
      $,
      id,
      params: {
        separate_files: this.separateFiles,
        watermark_text: this.watermarkText,
        watermark_color: this.watermarkColor,
        watermark_font_size: this.watermarkFontSize,
        watermark_opacity: this.watermarkOpacity,
      },
    });

    const filePath = `/tmp/${outputFilename}`;
    fs.writeFileSync(filePath, data);
    $.export("$summary", `Successfully downloaded document "${outputFilename}"`);

    return {
      filePath,
      rawData: data,
    };
  },
};
