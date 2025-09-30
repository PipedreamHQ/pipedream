import netlify from "../../netlify.app.mjs";

export default {
  key: "netlify-get-site",
  name: "Get Site",
  description: "Get a specified site. [See docs](https://docs.netlify.com/api/get-started/#get-sites)",
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
  },
  async run({ $ }) {
    const response = await this.netlify.getSite(this.siteId);
    $.export("$summary", `Got site ${response.name}`);
    return response;
  },
};
