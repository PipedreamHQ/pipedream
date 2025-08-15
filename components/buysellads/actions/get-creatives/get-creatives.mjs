import buysellads from "../../buysellads.app.mjs";

export default {
  key: "buysellads-get-creatives",
  name: "Get Creatives",
  description: "Returns the creative stats for line items. [See the documentation](https://docs.buysellads.com/advertiser-api/endpoints#creatives)",
  version: "0.0.1",
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
    const response = await this.buysellads.listCreatives({
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

    $.export("$summary", `Successfully fetched ${length} creative${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
