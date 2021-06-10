const axios = require("axios");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

module.exports = {
  type: "app",
  app: "mailgun",
  methods: {
    api (api) {
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: "api",
        key: this.$auth.api_key,
        public_key: this.$auth.api_key,
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
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Name",
      async options ({ page }) {
        const query = {
          limit: 50,
          skip: 50 * page,
        };
        const domains = await this.api("domains").list(query);
        return domains.map(domain => domain.name);
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
  },
};
