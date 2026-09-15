import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-ocr-predict",
  name: "Extract Text From Images and PDFs Using OCR",
  description: "Perform Optical Character Recognition (OCR) on images, PDFs, or ZIP archives. Supports two models: `mini-ocr-v1` for CAPTCHA-optimized OCR and `ocr-v1` for general-purpose document text extraction. Supports zonal OCR to extract text from specific regions of an image. **Notes:** - The `zone` query parameter cannot be given with .pdf and .zip types as it can only be applied to single image query. - The `page_range` query parameter cannot be given in any other type except .pdf types. - PDFs containing images in them are allowed only for processing. - The `mini-ocr-v1` model doesn’t support the following query parameters: - `page_range` (.pdf types) - `zone` [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "Url",
      description: "URL of the image or PDF (required if `file` not provided)",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "OCR model to use.",
      optional: false,
      options: ["mini-ocr-v1","ocr-v1"],
    },
    pageRange: {
      type: "string",
      label: "Page Range",
      description: "Specify page range for multi-page PDFs (e.g., '1,3,5-10' or 'allpages'). **Note:** This parameter can only be used with .pdf file types.",
      optional: true,
    },
    zone: {
      type: "string",
      label: "Zone",
      description: "Define OCR zones using coordinates (top:left:height:width). Multiple zones can be defined using commas. Only available for model 'ocr-v1'. **Note:** This parameter cannot be used with .pdf and .zip file types as it can only be applied to single image",
      optional: true,
    },
    newLine: {
      type: "string",
      label: "New Line",
      description: "Set to 1 to split output text into individual lines (default: 0)",
      optional: true,
      options: ["0","1"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/ocr/predict",
      data: {
        url: this.url,
        model: this.model,
        "page_range": this.pageRange,
        zone: this.zone,
        "new_line": this.newLine,
      },
    });
    $.export("$summary", "Successfully executed Extract Text From Images and PDFs Using OCR");
    return response;
  },
};
