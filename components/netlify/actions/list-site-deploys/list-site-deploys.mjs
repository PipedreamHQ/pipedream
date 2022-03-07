import netlify from "../../netlify.app.mjs";

export default {
  key: "netlify-list-site-deploys",
  name: "List Site Deploys",
  description: "Returns a list of all deploys for a specific site. [See docs](https://docs.netlify.com/api/get-started/#get-deploys)",
  version: "0.0.1",
  type: "action",
  props: {
    netlify,
    siteId: {
      propDefinition: [
        netlify,
        "siteId",
      ],
    },
  },
  async run({ $ }) {
    const response = this.netlify.listSiteDeploys(this.siteId);
    $.export("$summary", "Got deploys for site");
    return response;
  },
};
