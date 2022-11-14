const ahrefs = require("../../ahrefs.app.js");
const axios = require("axios");

module.exports = {
  name: "Get Referring Domains",
  description: "Get the referring domains that contain backlinks to the target URL or domain.",
  key: "ahrefs-get-referring-domains",
  version: "0.0.16",
  type: "action",
  props: {
    ahrefs,
    target: {
      propDefinition: [
        ahrefs,
        "target",
      ],
    },
    mode: {
      propDefinition: [
        ahrefs,
        "mode",
      ],
    },
    limit: {
      propDefinition: [
        ahrefs,
        "limit",
      ],
    },
  },
  async run() {
    return (await axios({
      url: "https://apiv2.ahrefs.com",
      params: {
        token: this.ahrefs.$auth.oauth_access_token,
        from: "refdomains",
        target: this.target,
        mode: this.mode,
        limit: this.limit,
        order_by: "domain_rating:desc",
        output: "json",
      },
    })).data;
  },
};
