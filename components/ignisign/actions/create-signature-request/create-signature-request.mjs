import ignisign from "../../ignisign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ignisign-create-signature-request",
  name: "Create Signature Request",
  description: "Initiates a document signature request through IgniSign. [See the documentation](https://ignisign.io/docs/ignisign-api/init-signature-request)",
  version: "0.0.1",
  type: "action",
  props: {
    ignisign,
    documentid: {
      propDefinition: [
        ignisign,
        "documentid",
      ],
    },
    signerid: {
      propDefinition: [
        ignisign,
        "signerid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ignisign.initDocumentSignature({
      documentId: this.documentid,
      signerId: this.signerid,
    });

    $.export("$summary", `Successfully initiated signature request with ID ${response.id}`);
    return response;
  },
};
