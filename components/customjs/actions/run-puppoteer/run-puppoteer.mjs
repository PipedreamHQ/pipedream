import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-run-puppoteer",
  name: "Run Puppoteer",
  description: "run-puppoteer. [See the documentation](https://www.customjs.space/api/docs#_5-run-puppoteer)",
  version: "0.0.1",
  type: "action",
  props: {
    customjs,
    code: {
      type: "string",
      label: "Code",
      description: "Enter code you want to run on puppeteer.",
    },
    filename: {
      propDefinition: [
        customjs,
        "filename",
      ],
    },
  },
  async run({ $ }) {
    const fileContent = await this.customjs.runPuppoteer({
      $,
      data: {
        input: this.code,
        code: "const { PUPPETEER } = require('./utils'); return PUPPETEER(input);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename);
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully run the puppoteer code.");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
