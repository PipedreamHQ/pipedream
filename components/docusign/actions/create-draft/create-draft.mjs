import createSignatureRequest from "../create-signature-request/create-signature-request.mjs";

export default {
  ...createSignatureRequest,
  key: "docusign-create-draft",
  version: "0.0.1",
  name: "Create Draft",
  description: "Creates and sends an envelope or creates a draft envelope. [See the docs here](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/)",
  type: "action",
  methods: {
    ...createSignatureRequest.methods,
    _getStatusType() {
      return "created";
    },
  },
};
