import ignisign from "../../ignisign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ignisign-get-signature-proof",
  name: "Get Signature Proof",
  description: "Retrieves a proof file for a specific signature. [See the documentation](https://ignisign.io/docs/category/ignisign-api)",
  version: "0.0.1",
  type: "action",
  props: {
    ignisign,
    signrequestid: {
      propDefinition: [
        ignisign,
        "signrequestid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ignisign.retrieveSignatureProof({
      signrequestid: this.signrequestid,
    });

    $.export("$summary", `Successfully retrieved signature proof for request ID: ${this.signrequestid}`);
    return response;
  },
};
