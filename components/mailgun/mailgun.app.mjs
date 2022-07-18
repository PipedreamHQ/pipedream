/* eslint-disable pipedream/props-description */
import formData from "form-data";
import Mailgun from "mailgun.js";
import pick from "lodash/pick.js";
import constants from "./common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailgun",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Name",
      async options({ page }) {
        const query = {
          limit: constants.DEFAULT_PAGE_SIZE,
          skip: constants.DEFAULT_PAGE_SIZE * page,
        };
        const domains = await this.api("domains").list(query);
        if (domains.length === 0) {
          throw new ConfigurationError("Failed to fetch domains");
        }
        return domains.map((domain) => domain.name);
      },
    },
    list: {
      type: "string",
      label: "Mailing List",
      async options({ page }) {
        const query = {
          limit: constants.DEFAULT_PAGE_SIZE,
          skip: constants.DEFAULT_PAGE_SIZE * page,
        };
        const lists = await this.api("lists").list(query);
        if (lists.length === 0) {
          throw new ConfigurationError("Failed to fetch lists");
        }
        return lists.map((list) => list.address);
      },
    },
    email: {
      type: "string",
      label: "Email Address",
      async options({ list }) {
        const members = await this.listMailingListMembers({
          list,
        });
        return members.map((member) => member.address);
      },
    },
    emailString: {
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
    bodyText: {
      type: "string",
      label: "Message Body (text)",
    },
    bodyHtml: {
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
      options: constants.OPTIONS.SUBSCRIBED,
    },
    upsert: {
      type: "string",
      label: "Update if exists?",
      description: "If `yes`, will update if a matching entry already exists; if `no`, will throw an error if a matching entry already exists",
      options: constants.OPTIONS.UPSERT,
      default: "no",
    },
    acceptableRiskLevels: {
      type: "string[]",
      label: "Acceptable Risk Levels",
      description: "If set, workflow execution will stop at this step if the email risk is not in this list",
      options: constants.OPTIONS.ACCEPTABLE_RISK_LEVELS,
      default: constants.OPTIONS.ACCEPTABLE_RISK_LEVELS_DEFAULT,
      optional: true,
    },
    haltOnError: {
      type: "boolean",
      label: "Halt on error?",
      default: true,
    },
  },
  methods: {
    api(api) {
      const mailgun = new Mailgun(formData);
      const config = {
        username: "api",
        key: this.$auth.api_key,
      };
      if (this.$auth.region === "EU") {
        config.url = "https://api.eu.mailgun.net";
      }
      const mg = mailgun.client(config);
      return mg[api];
    },
    async mailgunPostRequest(url) {
      return this.api("request").post(url);
    },
    async createMailinglistMember(opts = {}) {
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
      return this.api("lists").members.createMember(opts.list, data);
    },
    async createRoute(opts = {}) {
      return this.api("routes").create(opts);
    },
    async getMailingLists(opts = {}) {
      const { limit = 100 } = opts;
      const listsService = this.api("lists");
      let result = [];
      let address;
      const lists = [];
      do {
        const query = {
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
    async listMailingListMembers(opts = {}) {
      let data;
      if (opts.subscribed) {
        data = {
          subscribed: opts.subscribed,
        };
      }
      return this.api("lists").members.listMembers(opts.list, data);
    },
    async getMailingListMember(opts = {}) {
      return this.api("lists").members.getMember(opts.list, opts.address);
    },
    async deleteMailingListMember(opts = {}) {
      return this.api("lists").members.destroyMember(opts.list, opts.address);
    },
    async listDomains(opts = {}) {
      return this.paginate(
        (params) => this.api("domains").list({
          ...pick(opts, [
            "authority",
            "state",
          ]),
          ...params,
        }),
      );
    },
    async sendMail(opts = {}) {
      return this.api("messages").create(opts.domain, opts.msg);
    },
    async verifyEmail(opts = {}) {
      const result = await this.api("request").get("/v4/address/validate", {
        address: opts.address,
      });
      if (
        opts.acceptableRiskLevels.length > 0
          && !opts.acceptableRiskLevels.includes(result.body.risk)
      ) {
        throw new Error(`${result.body.risk} risk`);
      }
      return result.body;
    },
    async paginate(next, perPage = 100) {
      const results = [];
      for (let page = 0; ; page++) {
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
