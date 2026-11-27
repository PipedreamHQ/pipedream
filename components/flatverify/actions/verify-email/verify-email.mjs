import flatverify from "../../flatverify.app.mjs";

export default {
  key: "flatverify-verify-email",
  name: "Verify Email",
  description: "Check one email address and get back `valid`, `invalid`, `risky` or `unknown`, with a one-word reason in `sub_status` (e.g. `accepted`, `catch_all`, `role_account`, `disposable`, `mailbox_not_found`) and the flags `disposable`, `role`, `free` and `catch_all`."
    + " Use this for a single address, e.g. a new signup or form fill. For many addresses at once use **Verify List**."
    + " [See the documentation](https://flatverify.com/docs#single)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    flatverify,
    email: {
      propDefinition: [
        flatverify,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flatverify.verifyEmail({
      $,
      data: {
        email: this.email.trim(),
      },
    });
    $.export("$summary", `${response.email} is ${response.status}${response.sub_status
      ? ` (${response.sub_status})`
      : ""}`);
    return response;
  },
};
