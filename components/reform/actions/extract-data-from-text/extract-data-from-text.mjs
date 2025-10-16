import reform from "../../reform.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "reform-extract-data-from-text",
  name: "Extract Data From Text",
  description: "Extract structured data from unstructured text. [See the documentation](https://docs.reformhq.com/synchronous-data-processing/extract-from-text)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    reform,
    text: {
      type: "string",
      label: "Text Content",
      description: "The text to process",
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
    const response = await this.reform.extractDataFromText({
      $,
      data: {
        text_content: this.text,
        fields_to_extract: fields,
      },
    });

    $.export("$summary", "Successfully extracted data from text.");

    return response;
  },
};
