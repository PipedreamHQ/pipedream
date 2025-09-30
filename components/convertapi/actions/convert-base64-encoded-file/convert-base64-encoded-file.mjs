import FormData from "form-data";
import { saveFile } from "../../common/utils.mjs";
import convertapi from "../../convertapi.app.mjs";

export default {
  key: "convertapi-convert-base64-encoded-file",
  name: "Convert Base64 Encoded File",
  description: "This action converts a base64-string-encoded file into the user-specified format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    convertapi,
    base64String: {
      propDefinition: [
        convertapi,
        "base64String",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Converted output file name without extension. The extension will be added automatically.",
    },
    formatFrom: {
      propDefinition: [
        convertapi,
        "formatFrom",
      ],
      reloadProps: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.formatFrom) {
      const { paths } = await this.convertapi.getAllowedFormats({
        formatFrom: this.formatFrom,
      });

      const str = `/convert/${this.formatFrom}/to/`;

      const allowedFormats = Object.keys(paths).filter((format) => {
        if (format.startsWith(str)) {
          return true;
        }
      })
        .map((format) => format.slice(str.length));

      props.formatTo = {
        type: "string",
        label: "Format To",
        description: "The format to convert the file to.",
        options: allowedFormats,
      };
    }
    return props;
  },
  async run({ $ }) {
    const buffer = Buffer.from(this.base64String, "base64");
    const data = new FormData();
    data.append("File", buffer, `${this.filename}.${this.formatFrom}`);

    const { Files } = await this.convertapi.convertFileToFormat({
      $,
      data,
      maxBodyLength: Infinity,
      headers: data.getHeaders(),
      formatFrom: this.formatFrom,
      formatTo: this.formatTo,
    });

    await saveFile(Files);
    const filename = Files[0].FileName;

    $.export("$summary", `Successfully converted base64 encoded file to ${this.formatTo} and saved in /tmp directory as **${filename}**.`);
    return {
      filepath: `/tmp/${filename}`,
    };
  },
};
