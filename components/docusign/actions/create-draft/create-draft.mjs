import createSignatureRequest from "../create-signature-request/create-signature-request.mjs";

export default {
  ...createSignatureRequest,
  key: "docusign-create-draft",
  version: "0.0.3",
  name: "Create Draft",
  description: "Create and send an envelope, or create a draft envelope. [See the documentation here](https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/create/)",
  type: "action",
  methods: {
    ...createSignatureRequest.methods,
    _getStatusType() {
      return "created";
    },
  },
};
