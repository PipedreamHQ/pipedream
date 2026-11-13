import textkit from "../../textkit.app.mjs";

export default {
  key: "textkit-check-verification",
  name: "Check Verification",
  description: "Check the code a user entered against the one sent by **Start Verification**."
    + " Returns `verified: true` with `status: approved` on a match. A wrong code returns `verified: false` with `attempts_remaining`; an expired or exhausted verification returns `status: expired` or `max_attempts`."
    + " [See the documentation](https://jointextkit.com/docs/verify)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    textkit,
    phone: {
      propDefinition: [
        textkit,
        "phone",
      ],
      description: "The phone number the code was sent to, in E.164 format (e.g. `+14155550132`)",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The code the user entered (e.g. `123456`; `111111` in the sandbox)",
    },
  },
  async run({ $ }) {
    const response = await this.textkit.checkVerification({
      $,
      data: {
        phone: this.phone,
        code: this.code,
      },
    });
    $.export("$summary", response.verified
      ? `Verified ${this.phone}`
      : `Code not accepted for ${this.phone} (${response.status})`);
    return response;
  },
};
