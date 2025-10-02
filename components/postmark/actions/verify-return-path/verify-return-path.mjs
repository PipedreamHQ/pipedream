import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-verify-return-path",
  name: "Verify Return-Path DNS",
  description: "Verify Return-Path DNS record for the specified domain. [See the documentation](https://postmarkapp.com/developer/api/domains-api#domains-verify-return-path)",
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
    const response = this.postmark.verifyReturnPath({
      $,
      domainId: this.domainId.value,
    });

    $.export("$summary", `Return-Path Status for domain ${this.domainId.label} was successfully verified!`);
    return response;
  },
};
