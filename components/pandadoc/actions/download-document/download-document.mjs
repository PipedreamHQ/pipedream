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
    separateFiles: {
      type: "boolean",
      label: "Separate Files",
      description: "Download document bundle as a zip-archive of separate PDFs (1 file per section)",
      optional: true,
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
    fs;
    const response = await this.app.getDocument({
      id: this.id,
    });

    $.export("$summary", `Successfully fetched document status with ID ${this.id}`);
    return response;
  },
};
