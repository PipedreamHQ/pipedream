import { parseObject } from "../../common/utils.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pdforge-generate-pdf-from-template",
  name: "Generate PDF from Template",
  description: "Generate a document from a selected template. [See the documentation](https://docs.pdforge.com/pdfs-from-templates/synchronous-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template from which to generate the document",
    },
    data: {
      type: "object",
      label: "Data",
      description: "The object containing the variables for your PDF template",
    },
  },
  methods: {
    getAdditionalData() {
      return {
        templateId: this.templateId,
        data: parseObject(this.data),
      };
    },
    getFunction() {
      return this.pdforge.generateDocumentFromTemplate;
    },
    getSummary({ convertToImage }) {
      return `${convertToImage
        ? "PNG"
        : "PDF"} generated successfully from template ID: ${this.templateId}`;
    },
  },
};
