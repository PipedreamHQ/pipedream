import googleRecaptcha from "../../google_recaptcha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Validate reCAPTCHA v3",
  version: "0.0.1",
  key: "google_recaptcha-validate-v3-recaptcha",
  description: "Validate a Google reCAPTCHA v3 request. [See docs here](https://developers.google.com/recaptcha/docs/verify)",
  props: {
    googleRecaptcha,
    remote_ip: {
      type: "string",
      label: "Remote IP Address",
      description: "The IP Address originating the request. This whould be the user IP where the challenge was executed on the frontend.",
      default: "{{steps.trigger.event.client_ip}}",
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
    return await axios($, {
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${this.$auth.secret}&response=${this.token}&remoteip=${this.remote_ip}`,
    });
  },
};
