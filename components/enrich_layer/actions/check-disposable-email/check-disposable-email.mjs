import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-check-disposable-email",
  name: "Check Disposable Email",
  description: "Check if an email address belongs to a disposable email service. Cost: 0 credits. [See the documentation](https://enrichlayer.com/docs/api/v2/contact-api/disposable-email-address-check).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to check (e.g., `johndoe@enrichlayer.com`).",
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.checkDisposableEmail({
      $,
      params: {
        email: this.email,
      },
    });
    if (typeof response.is_disposable_email === "boolean") {
      $.export("$summary", `Email ${this.email} is ${response.is_disposable_email
        ? "disposable"
        : "not disposable"}`);
    } else {
      $.export("$summary", `Disposable email check completed for ${this.email}`);
    }
    return response;
  },
};
