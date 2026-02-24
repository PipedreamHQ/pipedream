import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-check-disposable-email",
  name: "Check Disposable Email",
  description: "Check if an email address belongs to a disposable email service. Cost: 0 credits. [See the docs](https://enrichlayer.com/docs).",
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
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/disposable-email",
      params: {
        email: this.email,
      },
    });
    if (typeof response.is_disposable_email === "boolean") {
      $.export("$summary", `Email ${this.email} is ${response.is_disposable_email ? "disposable" : "not disposable"}`);
    } else {
      $.export("$summary", `Disposable email check completed for ${this.email}`);
    }
    return response;
  },
};
