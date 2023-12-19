import cuttLy from "../../cutt_ly.app.mjs";

export default {
  key: "cutt_ly-get-url-analytics",
  name: "Get URL Analytics",
  description: "Retrieves statistical information about a shortened url. [See the documentation](https://cutt.ly/cuttly-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cuttLy,
    shortenedUrl: {
      propDefinition: [
        cuttLy,
        "shortenedUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cuttLy.getStatistics({
      shortenedUrl: this.shortenedUrl,
    });
    $.export("$summary", `Retrieved statistics for ${this.shortenedUrl}`);
    return response;
  },
};
