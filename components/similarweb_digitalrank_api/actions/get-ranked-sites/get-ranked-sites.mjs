import similarweb from "../../similarweb_digitalrank_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "similarweb_digitalrank_api-get-ranked-sites",
  name: "Get Ranked Sites",
  description: "List the top-ranking websites globally. [See the documentation](https://developers.similarweb.com/reference/top-similarrank-sites-all-traffic)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    similarweb,
    limit: {
      propDefinition: [
        similarweb,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.similarweb.listTopRankingWebsites({
      limit: this.limit,
    });

    $.export("$summary", `Successfully listed the top ${this.limit} ranking websites globally.`);
    return response;
  },
};
