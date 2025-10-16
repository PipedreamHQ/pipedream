import common from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "voilanorbert-verifiy-email",
  name: "Verify Email",
  description: `Verifies the given list of emails.
  In case your account does not have a sufficient Verify API balance the service will try to auto refill the balance by charging using the billing details of the account. If it fails to charge, an HTTP status code of 402 will be returned.
  [See the docs here](https://api.voilanorbert.com/2018-01-08/#verify-endpoint-post)`,
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    emails: {
      propDefinition: [
        common.props.voilanorbert,
        "emails",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to send the webhook to. Required for Pipedream Connect. If not specified, the workflow will be suspended until verification results are returned.",
      optional: true,
    },
  },
  methods: {
    async processEvent({ $ }) {
      const { resume_url } = this.webhookUrl
        ? {
          resume_url: this.webhookUrl,
        }
        : $.flow
          ? $.flow.suspend()
          : {
            resume_url: undefined,
          };
      if (!resume_url) {
        throw new ConfigurationError("Webhook URL is required for Pipedream Connect.");
      }

      return this.voilanorbert.verifyEmails({
        emails: this.emails.toString(),
        webhook: resume_url,
      });
    },
    getSummary() {
      return "Emails Successfully sent for verification!";
    },
  },
};
