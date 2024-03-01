import tokenMetrics from "../../token_metrics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "token_metrics-get-grades",
  name: "Get Short Term Grades",
  description: "Get the list of short term grades for a specified token and date range. [See the documentation](https://developers.tokenmetrics.com/reference/trader-grades)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tokenMetrics,
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
    },
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tokenMetrics.getTraderGrades({
      tokenId: this.tokenId,
      startDate: this.startDate,
      endDate: this.endDate,
    });

    $.export("$summary", `Successfully retrieved short term grades for token ID ${this.tokenId}`);
    return response;
  },
};
