import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-email",
  name: "Verify Email",
  description: "Validates the input email and returns fully verified email data. Props include 'email' (required), the email address to be verified.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    addressfinder,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to be verified",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.addressfinder.verifyEmailAddress({
      email: this.email,
    });
    $.export("$summary", `Email verification status: ${response.is_verified
      ? "Verified"
      : "Not Verified"}`);
    return response;
  },
};
