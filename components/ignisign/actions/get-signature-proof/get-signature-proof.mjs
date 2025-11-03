import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-get-signature-proof",
  name: "Get Signature Proof",
  description: "Retrieves a proof file for a specific signature. [See the documentation](https://ignisign.io/docs/category/ignisign-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ignisign,
    signatureRequestId: {
      propDefinition: [
        ignisign,
        "signatureRequestId",
      ],
    },
    documentId: {
      propDefinition: [
        ignisign,
        "documentId",
        ({ signatureRequestId }) => ({
          signatureRequestId,
        }),
      ],
      withLabel: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.ignisign.getSignatureProof({
      $,
      documentId: this.documentId.value,
      responseType: "stream",
    });

    const pipeline = promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(`/tmp/${this.documentId.label}`));

    $.export("$summary", `Successfully retrieved signature proof for request ID: ${this.signatureRequestId} and saved in /tmp directory.`);
    return {
      filename: this.documentId.label,
      filepath: `/tmp/${this.documentId.label}`,
    };
  },
};
