import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-get-website-technology",
  name: "Get Website Technology",
  description: "Retrieves the core technology used on a designated website. (CMS, Framework, Analytics, CDN, Hosting, etc.) [See the documentation](https://docs.piloterr.com/v2/api-reference/website/technology)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    piloterr,
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to retrieve core technology information from",
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.getWebsiteTechnology({
      params: {
        query: this.url,
      },
      $,
    });
    $.export("$summary", `Successfully retrieved technology information for website: ${this.url}`);
    return response;
  },
};
