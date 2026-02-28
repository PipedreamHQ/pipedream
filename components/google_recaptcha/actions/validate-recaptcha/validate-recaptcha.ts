import googleRecaptcha from "../../app/google_recaptcha.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Validate reCAPTCHA Response",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_recaptcha-validate-recaptcha",
  description: "Validate a Google reCAPTCHA request (v2 or v3). [See docs here](https://developers.google.com/recaptcha/docs/verify)",
  props: {
    googleRecaptcha,
    remote_ip: {
      type: "string",
      label: "Remote IP Address",
      description: "The IP Address originating the request. This would be the user IP where the challenge was executed on the frontend.",
      default: "{{steps.trigger.event.client_ip}}",
      optional: true,
    },
    token: {
      type: "string",
      label: "Token",
      description: "The reCAPTCHA response token to validate. This is the response when the challenge is executed on the frontend.",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const response = await this.googleRecaptcha.validateRecaptcha({
      $,
      params: {
        response: this.token,
        remoteip: this.remote_ip,
      },
    });
    $.export("$summary", "reCAPTCHA validation request has been sent.");
    return response;
  },
});
