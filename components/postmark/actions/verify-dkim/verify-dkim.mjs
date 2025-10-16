import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-verify-dkim",
  name: "Verify DKIM",
  description: "Verify DKIM keys for the specified domain. [See the documentation](https://postmarkapp.com/developer/api/domains-api#domains-verify-dkim)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postmark,
    domainId: {
      propDefinition: [
        postmark,
        "domainId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = this.postmark.verifyDKIM({
      $,
      domainId: this.domainId.value,
    });

    $.export("$summary", `DKIM keys for domain ${this.domainId.label} was successfully verified!`);
    return response;
  },
};
