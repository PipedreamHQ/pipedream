import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import { getUrlOrFile } from "../../common/utils.mjs";
import ocrspace from "../../ocrspace.app.mjs";

export default {
  props: {
    ocrspace,
    language: {
      propDefinition: [
        ocrspace,
        "language",
      ],
    },
    isOverlayRequired: {
      propDefinition: [
        ocrspace,
        "isOverlayRequired",
      ],
    },
    detectOrientation: {
      propDefinition: [
        ocrspace,
        "detectOrientation",
      ],
    },
    scale: {
      propDefinition: [
        ocrspace,
        "scale",
      ],
    },
    isTable: {
      propDefinition: [
        ocrspace,
        "isTable",
      ],
    },
    ocrEngine: {
      propDefinition: [
        ocrspace,
        "ocrEngine",
      ],
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const {
      url, file,
    } = getUrlOrFile(this.file);

    if (url) data.append("url", url);
    if (file) data.append("base64Image", file);
    if (this.imageLanguage) data.append("language", this.imageLanguage);
    if (this.isOverlayRequired) data.append("isOverlayRequired", `${this.isOverlayRequired}`);
    if (this.filetype) data.append("filetype", this.filetype);
    if (this.detectOrientation) data.append("detectOrientation", `${this.detectOrientation}`);
    if (this.scale) data.append("scale", `${this.scale}`);
    if (this.isTable) data.append("isTable", `${this.isTable}`);
    if (this.ocrEngine) data.append("OCREngine", this.ocrEngine);

    const response = await this.ocrspace.processImage({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", this.getSummary());

    if (response.ErrorMessage) {
      throw new ConfigurationError(response.ErrorMessage[0]);
    }

    return response;
  },
};
