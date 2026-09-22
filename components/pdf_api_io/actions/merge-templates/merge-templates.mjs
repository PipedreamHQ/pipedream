import pdfApiIo from "../../pdf_api_io.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pdf_api_io-merge-templates",
  name: "Merge Templates",
  description: "Merge two templates into a single PDF document. Returns a URL to the PDF document. [See the documentation](https://pdf-api.io/en/docs/api/merge-templates)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pdfApiIo,
    template1: {
      propDefinition: [
        pdfApiIo,
        "templateId",
      ],
      label: "Template 1",
      description: "The first template to merge",
    },
    data1: {
      type: "object",
      label: "Data 1",
      description: "An object containing key-value pairs representing the data to be used in the first template. The keys should match the placeholders you defined in the PDF template.",
    },
    template2: {
      propDefinition: [
        pdfApiIo,
        "templateId",
      ],
      label: "Template 2",
      description: "The second template to merge",
    },
    data2: {
      type: "object",
      label: "Data 2",
      description: "An object containing key-value pairs representing the data to be used in the second template. The keys should match the placeholders you defined in the PDF template.",
    },
  },
  async run({ $ }) {
    const response = await this.pdfApiIo.mergeTemplates({
      $,
      data: {
        templates: [
          {
            id: this.template1,
            data: parseObject(this.data1),
          },
          {
            id: this.template2,
            data: parseObject(this.data2),
          },
        ],
        output: "url",
      },
    });
    $.export("$summary", "Successfully merged templates");
    return response;
  },
};
