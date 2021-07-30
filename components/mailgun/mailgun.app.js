const formData = require("form-data");
const Mailgun = require("mailgun.js");

module.exports = {
  type: "app",
  app: "mailgun",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Name",
      async options({ page }) {
        const query = {
          limit: 50,
          skip: 50 * page,
        };
        const domains = await this.api("domains").list(query);
        return domains.map((domain) => domain.name);
      },
    },
    email: {
      type: "string",
      label: "Email Address",
    },
    haltOnError: {
      type: "boolean",
      label: "Halt on error?",
      default: true,
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Mailgun for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      },
    },
    webhookSigningKey: {
      type: "string",
      secret: true,
      label: "Mailgun webhook signing key",
      description:
        "Your Mailgun webhook signing key, found " +
        "[in your Mailgun dashboard](https://app.mailgun.com/app/dashboard), located under " +
        "Settings on the left-hand nav and then in API Keys look for webhook signing key. " +
        "Required to compute the authentication signature of events.",
    },
  },
  methods: {
    api(api) {
      const config = {
        username: "api",
        key: this.$auth.api_key,
        public_key: this.$auth.api_key,
      };
      if (this.$auths.region === "EU") {
        config.url = "https://api.eu.mailgun.net";
      }
      const mailgun = new Mailgun(formData);
      return mailgun.client(config)[api];
    },
  },
};
