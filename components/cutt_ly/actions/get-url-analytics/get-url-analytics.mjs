import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-get-url-analytics",
  name: "Get URL Analytics",
  description: "Retrieves statistical information about a shortened url. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cuttLy,
    shortenedUrl: {
      type: "string",
      label: "Shortened URL",
      description: "The shortened URL for which you want statistics",
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.callApi({
      params: {
        stats: this.shortenedUrl,
      },
      $,
    });
    $.export("$summary", `Retrieved statistics for ${this.shortenedUrl}`);
    return response;
  },
};
