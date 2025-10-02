import app from "../../similarweb_digitalrank_api.app.mjs";

export default {
  key: "similarweb_digitalrank_api-get-ranked-sites",
  name: "Get Ranked Sites",
  description: "List the top-ranking websites globally. [See the documentation](https://developers.similarweb.com/docs/digital-rank-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listTopRankingWebsites({
      $,
      params: {
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully listed the top ${this.limit} ranking websites globally.`);
    return response;
  },
};
