import convertapi from "../../convertapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "convertapi-convert-file",
  name: "Convert File",
  description: "Use this action to convert files to the chosen format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    convertapi,
    file: {
      propDefinition: [
        convertapi,
        "file",
      ],
    },
    format: {
      propDefinition: [
        convertapi,
        "format",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.convertapi.convertFileToFormat({
        file: this.file,
        format: this.format,
      });

      $.export("$summary", `Successfully converted file to ${this.format || "default"} format.`);
      return response;
    } catch (error) {
      throw new Error(`Failed to convert file: ${error.message}`);
    }
  },
};
