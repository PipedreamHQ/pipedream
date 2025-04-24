import convertapi from "../../convertapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "convertapi-convert-base64-encoded-file",
  name: "Convert Base64 Encoded File",
  description: "This action converts a base64-string-encoded file into the user-specified format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    convertapi,
    base64String: {
      propDefinition: [
        convertapi,
        "base64String",
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
    const response = await this.convertapi.convertBase64ToFormat({
      base64String: this.base64String,
      format: this.format,
    });

    const files = response.Files || [];
    for (const file of files) {
      const filePath = `/tmp/${file.FileName}`;
      await axios($, {
        method: "GET",
        url: file.Url,
        responseType: "arraybuffer",
      }).then((buffer) => require("fs").promises.writeFile(filePath, buffer));
    }

    $.export("$summary", `Successfully converted base64 encoded file to ${this.format || "default format"}`);
    return response;
  },
};
