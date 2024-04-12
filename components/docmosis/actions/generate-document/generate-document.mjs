import docmosis from "../../docmosis.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "docmosis-generate-document",
  name: "Generate Document",
  description: "Generates a document by merging data with a Docmosis template. [See the documentation](https://resources.docmosis.com/documentation/cloud/dws4/cloud-web-services-guide-dws4.pdf)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    docmosis,
    templateId: {
      propDefinition: [
        docmosis,
        "templateId",
      ],
    },
    dataToMerge: {
      propDefinition: [
        docmosis,
        "dataToMerge",
      ],
    },
    outputFormat: {
      propDefinition: [
        docmosis,
        "outputFormat",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docmosis.generateDocument({
      templateId: this.templateId,
      dataToMerge: this.dataToMerge,
      outputFormat: this.outputFormat,
    });

    const outputPath = `/tmp/generatedDocument.${this.outputFormat || "pdf"}`;
    const fs = require("fs");
    fs.writeFileSync(outputPath, response);

    $.export("$summary", `Generated document with template ID ${this.templateId} is stored at ${outputPath}`);
    return {
      outputPath,
    };
  },
};
