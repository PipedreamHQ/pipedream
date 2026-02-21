import { axios } from "@pipedream/platform";
import {
  IMAGE_FILETYPE_OPTIONS,
  LANGUAGE_OPTIONS,
  OCR_ENGINE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "ocrspace",
  propDefinitions: {
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`)",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language setting for image OCR processing.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    isOverlayRequired: {
      type: "boolean",
      label: "Is Overlay Required",
      description: "If true, returns the coordinates of the bounding boxes for each word. If false, the OCR'ed text is returned only as a text block (this makes the JSON response smaller). Overlay data can be used, for example, to show [text over the image](https://ocr.space/english).",
      optional: true,
    },
    filetype: {
      type: "string",
      label: "File Type",
      description: "Overwrites the automatic file type detection based on content-type. Supported image file formats are png, jpg (jpeg), gif, tif (tiff) and bmp. For document ocr, the api supports the Adobe PDF format. Multi-page TIFF files are supported.",
      options: IMAGE_FILETYPE_OPTIONS,
      optional: true,
    },
    detectOrientation: {
      type: "boolean",
      label: "Detect Orientation",
      description: "If set to true, the api autorotates the image correctly and sets the TextOrientation parameter in the JSON response. If the image is not rotated, then TextOrientation=0, otherwise it is the degree of the rotation, e. g. \"270\".",
      optional: true,
    },
    scale: {
      type: "boolean",
      label: "Scale",
      description: "If set to true, the api does some internal upscaling. This can improve the OCR result significantly, especially for low-resolution PDF scans. Note that the front page demo uses scale=true, but the API uses scale=false by default. See also this OCR forum post.",
      optional: true,
    },
    isTable: {
      type: "boolean",
      label: "Is Table",
      description: "If set to true, the OCR logic makes sure that the parsed text result is always returned line by line. This switch is recommended for [table OCR](https://ocr.space/tablerecognition), [receipt OCR](https://ocr.space/receiptscanning), invoice processing and all other type of input documents that have a table like structure.",
      optional: true,
    },
    ocrEngine: {
      type: "string",
      label: "OCR Engine",
      description: "Engine 1 is default. [See OCR Engines](https://ocr.space/OCRAPI#ocrengine).",
      options: OCR_ENGINE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ocr.space";
    },
    _headers(headers = {}) {
      return {
        "apikey": this.$auth.apikey,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    processImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/parse/image",
        ...opts,
      });
    },
  },
};
