import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-run-puppeteer",
  name: "Run Puppeteer",
  description: "Run Puppeteer. [See the documentation](https://www.customjs.space/api/docs#_5-run-puppeteer)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    customjs,
    code: {
      type: "string",
      label: "Code",
      description: "Enter the code you want to run on puppeteer. For example: `await page.goto(\"https://example.com\");` will return a screenshot of https://example.com.",
    },
    filename: {
      propDefinition: [
        customjs,
        "filename",
      ],
      description: "Download the PNG file to the `/tmp` directory with the specified filename.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
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

    const filepath = normalizeFilepath(this.filename, "png");
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully ran the puppeteer code.");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
