import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-create-signing-link",
  name: "Create Signing Link",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description:
    "Generate an authenticated signing link for a data request recipient. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    dataRequestId: {
      propDefinition: [
        docspring,
        "dataRequestId",
      ],
    },
    tokenType: {
      type: "string",
      label: "Link Type",
      description: "Email links expire in 30 days; API links expire in 1 hour.",
      options: [
        { label: "Email (expires in 30 days)", value: "email" },
        { label: "API (expires in 1 hour)", value: "api" },
      ],
      default: "email",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.docspring.createToken({
      $,
      dataRequestId: this.dataRequestId,
      params: { type: this.tokenType || "email" },
    });
    const token = response.token || response;
    const result = {
      id: token.id,
      signing_url: token.data_request_url,
      expires_at: token.expires_at,
    };
    $.export("$summary", `Created signing link for \`${this.dataRequestId}\``);
    return result;
  },
};
