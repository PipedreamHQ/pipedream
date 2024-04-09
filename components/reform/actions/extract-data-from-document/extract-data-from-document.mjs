import reform from "../../reform.app.mjs";
import utils from "../common/utils.mjs";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "reform-extract-data-from-document",
  name: "Extract Data From Document",
  description: "Extract structured data from a document. [See the documentation](https://docs.reformhq.com/synchronous-data-processing/extract)",
  version: "0.0.1",
  type: "action",
  props: {
    reform,
    document: {
      propDefinition: [
        reform,
        "document",
      ],
    },
    fields: {
      propDefinition: [
        reform,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const fields = utils.parseFields(this.fields);
    const documentPath = this.document.includes("tmp/")
      ? this.document
      : `/tmp/${this.document}`;

    const formData = new FormData();
    formData.append("document", fs.createReadStream(documentPath));
    formData.append("fields_to_extract", JSON.stringify(fields));

    const response = await this.reform.extractDataFromDocument({
      $,
      data: formData,
    });

    $.export("$summary", "Successfully extracted data from document.");

    return response;
  },
};
