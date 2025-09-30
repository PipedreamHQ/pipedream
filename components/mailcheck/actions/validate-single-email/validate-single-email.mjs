import mailcheck from "../../mailcheck.app.mjs";

export default {
  key: "mailcheck-validate-single-email",
  name: "Process Single Email",
  description: "Process a single email synchronously. [See the documentation](https://app.mailcheck.co/docs?from=docs#post-/v1/singleEmail-check)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailcheck,
    email: {
      propDefinition: [
        mailcheck,
        "email",
      ],
    },
  },
  async run({ $ }) {

    const response = await this.mailcheck.verifyEmail({
      $,
      data: {
        email: this.email,
      },
    });

    $.export("$summary", `Successfully fetched data for ${this.email}`);
    return response;
  },
};
