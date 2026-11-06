import kovapdf from "../../kovapdf.app.mjs";
import {
  getFileObject, MAX_FILE_BYTES,
} from "../../common/utils.mjs";

export default {
  key: "kovapdf-verify-pdf",
  name: "Verify Signatures in PDF",
  description: "Check every digital signature in a PDF: who signed, whether the document changed after signing, the certificate chain and the timestamp. Returns a report with one entry per signature and its verdict. [See the documentation](https://www.kovapdf.com/developers/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kovapdf,
    file: {
      propDefinition: [
        kovapdf,
        "file",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const report = await this.kovapdf.verifyPdf({
      $,
      data: {
        file: await getFileObject(this.file, MAX_FILE_BYTES.verify),
      },
    });
    const count = report.signatures.length;
    $.export("$summary", `Found ${count} signature${count === 1
      ? ""
      : "s"}`);
    return report;
  },
};
