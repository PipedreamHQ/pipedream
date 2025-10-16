import { parseObject } from "../../common/utils.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pdforge-generate-pdf-from-html",
  name: "Generate PDF from HTML",
  description: "Generate a PDF document from HTML content. [See the documentation](https://docs.pdforge.com/html-to-pdf-conversion/synchronous-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML content you want to render",
    },
    pdfParams: {
      type: "object",
      label: "PDF Params",
      description: "The object containing the parameters for your PDF. [See all the options here](https://docs.pdforge.com/options/pdf-params).",
      optional: true,
    },
  },
  methods: {
    getAdditionalData() {
      return {
        html: this.html,
        pdfParams: parseObject(this.pdfParams),
      };
    },
    getFunction() {
      return this.pdforge.generatePDFfromHTML;
    },
    getSummary({ convertToImage }) {
      return `${convertToImage
        ? "PNG"
        : "PDF"} successfully generated from provided HTML content.`;
    },
  },
};
