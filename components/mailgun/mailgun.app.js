/* eslint-disable pipedream/props-description */
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const pick = require("lodash.pick");

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
        "true",
        "false",
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
    async createMailinglistMember(mailgun, opts) {
      const data = pick(opts, [
        "address",
        "name",
        "subscribed",
        "upsert",
      ]);
      const vars = JSON.stringify(opts.vars);
      if (vars) {
        data.vars = vars;
      }
      return await this.api("lists").members.createMember(opts.list, data);
    },
    async getMailingLists(opts = {}) {
      const { limit = 100 } = opts;
      const listsService = this.api("lists");
      let result = [];
      let address;
      let lists = [];
      do {
        let query = {
          limit,
        };
        if (address) {
          query["address"] = address;
        }
        result = await listsService.list(query);
        lists.push(...result);
        if (result.length) {
          address = result[result.length - 1].address;
        }
      } while (result.length);
      return lists;
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
