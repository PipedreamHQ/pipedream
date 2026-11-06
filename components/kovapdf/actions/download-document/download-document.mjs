import fs from "fs";
import { randomUUID } from "crypto";
import kovapdf from "../../kovapdf.app.mjs";

export default {
  key: "kovapdf-download-document",
  name: "Download Document",
  description: "Download the PDF of a signature request to the `/tmp` directory and return the saved file path. Choose `final` for the finished document once everyone has signed. [See the documentation](https://www.kovapdf.com/developers/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kovapdf,
    signRequestId: {
      propDefinition: [
        kovapdf,
        "signRequestId",
      ],
    },
    version: {
      type: "string",
      label: "Version",
      description: "`original` is the file as sent, `current` has every signature so far, `final` is the finished document once everyone has signed.",
      options: [
        "original",
        "current",
        "final",
      ],
      default: "final",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const data = await this.kovapdf.downloadDocument({
      $,
      signRequestId: this.signRequestId,
      params: {
        version: this.version,
      },
    });
    const filePath = `/tmp/kovapdf-${this.signRequestId}-${this.version}-${randomUUID()}.pdf`;
    fs.writeFileSync(filePath, Buffer.from(data));
    $.export("$summary", `Successfully saved the ${this.version} document to ${filePath}`);
    return {
      filePath,
    };
  },
};
