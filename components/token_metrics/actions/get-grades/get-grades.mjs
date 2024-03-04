import app from "../../token_metrics.app.mjs";

export default {
  key: "token_metrics-get-grades",
  name: "Get Short Term Grades",
  description: "Gets the list of short term grades for a specified token and date range. [See the documentation](https://developers.tokenmetrics.com/reference/trader-grades)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    tokenId: {
      propDefinition: [
        app,
        "tokenId",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTraderGrades({
      $,
      params: {
        tokenId: this.tokenId,
        startDate: this.startDate,
        endDate: this.endDate,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved short term grades for token ID ${this.tokenId}`);

    return response;
  },
};
