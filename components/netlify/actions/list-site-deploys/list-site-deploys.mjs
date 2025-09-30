import netlify from "../../netlify.app.mjs";

export default {
  key: "netlify-list-site-deploys",
  name: "List Site Deploys",
  description: "Returns a list of all deploys for a specific site. [See docs](https://docs.netlify.com/api/get-started/#get-deploys)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    netlify,
    siteId: {
      propDefinition: [
        netlify,
        "siteId",
      ],
    },
    max: {
      propDefinition: [
        netlify,
        "max",
      ],
      description: "Max number of sites to return",
    },
  },
  async run({ $ }) {
    const results = [];
    let r = [];
    let page = 1;

    do {
      r = await this.netlify.listSiteDeploys(this.siteId, {
        page,
        perPage: 100,
      });
      results.push(...r);
      page++;

      if (this.max && results.length >= this.max) {
        results.length = this.max;
        break;
      }
    } while (r.length > 0);

    $.export("$summary", "Got deploys for site");
    return results;
  },
};
