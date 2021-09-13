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
    api (api) {
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: "api",
        key: this.$auth.api_key,
      });
      return mg[api];
    },
    async suppress (domain, type, suppression) {
      const res = await axios({
        url: `https://api.mailgun.net/v3/${encodeURIComponent(domain)}/${encodeURIComponent(type)}`,
        method: "POST",
        auth: {
          username: "api",
          password: this.$auth.api_key,
        },
        headers: {
          "content-type": "application/json",
        },
        // eslint-disable-next-line multiline-ternary, array-bracket-newline
        data: JSON.stringify(Array.isArray(suppression) ? suppression : [suppression]),
      });
      return res.data;
    },
  },
};
