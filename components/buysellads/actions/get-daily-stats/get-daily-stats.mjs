import buysellads from "../../buysellads.app.mjs";

export default {
  key: "buysellads-get-daily-stats",
  name: "Get Daily Stats",
  description: "Returns the daily stats for active line items. [See the documentation](https://docs.buysellads.com/advertiser-api/endpoints#daily-stats)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    buysellads,
    lineItemId: {
      propDefinition: [
        buysellads,
        "lineItemId",
      ],
    },
    startDate: {
      propDefinition: [
        buysellads,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        buysellads,
        "endDate",
      ],
    },
    csvOutput: {
      propDefinition: [
        buysellads,
        "csvOutput",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.buysellads.listDailyStats({
      $,
      params: {
        lineitemId: this.lineItemId,
        startDate: this.startDate,
        endDate: this.endDate,
        type: this.csvOutput
          ? "csv"
          : undefined,
      },
    });

    const length = this.csvOutput
      ? response.split("\n").length - 1
      : response.length;

    $.export("$summary", `Successfully fetched ${length} daily stat${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
