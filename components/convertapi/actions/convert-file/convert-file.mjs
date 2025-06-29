import FormData from "form-data";
import fs from "fs";
import {
  checkTmp, saveFile,
} from "../../common/utils.mjs";
import convertapi from "../../convertapi.app.mjs";

export default {
  key: "convertapi-convert-file",
  name: "Convert File",
  description: "Use this action to convert files to the chosen format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.2",
  type: "action",
  props: {
    convertapi,
    file: {
      type: "string",
      label: "File",
      description: "The path to the file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
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
      accessMode: "read-write",
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
    try {
      const file = fs.createReadStream(checkTmp(this.file));
      const data = new FormData();
      data.append("File", file);

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

      $.export("$summary", `Successfully converted file to ${this.formatTo} format and saved in /tmp directory as **${filename}**.`);
      return {
        filepath: `/tmp/${filename}`,
      };
    } catch (error) {
      throw new Error(`Failed to convert file: ${error.message}`);
    }
  },
};
