import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-website-technology",
  name: "Get Website Technology",
  description: "Retrieves the core technology used on a designated website. This includes information on any CMS, framework, analytics, CDN, and hosting.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    piloterr,
    url: {
      propDefinition: [
        piloterr,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getWebsiteTechnology({
      $,
      url: this.url,
    });
    $.export("$summary", `Successfully retrieved technology information for website: ${this.url}`);
    return response;
  },
};
