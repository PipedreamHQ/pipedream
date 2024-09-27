import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-run-puppeteer",
  name: "Run Puppeteer",
  description: "run-puppeteer. [See the documentation](https://www.customjs.space/api/docs#_5-run-puppeteer)",
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
    const fileContent = await this.customjs.runPuppeteer({
      $,
      data: {
        input: this.code,
        code: "const { PUPPETEER } = require('./utils'); return PUPPETEER(input);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename);
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully run the puppeteer code.");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
