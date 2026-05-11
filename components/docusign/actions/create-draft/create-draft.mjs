import createSignatureRequest from "../create-signature-request/create-signature-request.mjs";

export default {
  ...createSignatureRequest,
  key: "docusign-create-draft",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
