/* eslint-disable pipedream/props-description */

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
    list: {
      type: "string",
      label: "Mailing List",
      async options ({ page }) {
        const query = {
          limit: 50,
          skip: 50 * page,
        };
        const lists = await this.api("lists").list(query);
        return lists.map((list) => list.address);
      },
    },
    email: {
      type: "string",
      label: "Email Address",
    },
    emails: {
      type: "string[]",
      label: "Email Addresses",
    },
    name: {
      type: "string",
      label: "Name",
    },
    subject: {
      type: "string",
      label: "Subject",
    },
    body_text: {
      type: "string",
      label: "Message Body (text)",
    },
    body_html: {
      type: "string",
      label: "Message Body (HTML)",
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority ranks low to high, and higher priority routes are handled first",
    },
    description: {
      type: "string",
      label: "Description",
    },
    vars: {
      type: "object",
      label: "Vars",
      description: "Extra arbitrary list member data",
    },
    subscribed: {
      type: "string",
      label: "Subscribed?",
      options: [
        "yes",
        "no",
      ],
    },
    upsert: {
      type: "string",
      label: "Update if exists?",
      description: "If `yes`, will update if a matching entry already exists; if `no`, will " +
        "throw an error if a matching entry already exists",
      options: [
        "yes",
        "no",
      ],
      default: "no",
    },
    acceptableRiskLevels: {
      type: "string[]",
      label: "Acceptable Risk Levels",
      description: "If set, workflow execution will stop at this step if the email risk is not " +
        "in this list",
      options: [
        "high",
        "medium",
        "low",
        "unknown",
      ],
      default: [
        "medium",
        "low",
        "unknown",
      ],
      optional: true,
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
    async paginate (next, perPage = 100) {
      const results = [];
      for (let page = 0;; page++) {
        const query = {
          limit: perPage,
          skip: page * perPage,
        };
        const result = await next(query);
        if (Array.isArray(result) && result.length > 0) {
          results.push(...result);
        } else {
          return results;
        }
      }
    },
  },
};
