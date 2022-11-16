const ahrefs = require("../../ahrefs.app.js");
const axios = require("axios");

module.exports = {
  name: "Get Backlinks",
  key: "ahrefs-get-backlinks",
  description: "Get the backlinks for a domain or URL with details for the referring pages (e.g., anchor and page title).",
  version: "0.0.8",
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
        from: "backlinks",
        target: this.target,
        mode: this.mode,
        limit: this.limit,
        order_by: "ahrefs_rank:desc",
        output: "json",
      },
    })).data;
  },
};
