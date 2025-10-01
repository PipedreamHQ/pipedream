import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-create-screenshot",
  name: "Create Screenshot",
  description: "Create a screenshot of a website. [See the documentation](https://www.customjs.space/api/docs#_3-create-screenshot)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    customjs,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the website to take a screenshot of",
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
    const fileContent = await this.customjs.createScreenshot({
      $,
      data: {
        input: this.url,
        code: "const { SCREENSHOT } = require(\"./utils\"); return SCREENSHOT(input);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename, "png");
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", `Successfully created screenshot of ${this.url}`);
    return {
      filename: this.filename,
      filepath,
    };
  },
};
