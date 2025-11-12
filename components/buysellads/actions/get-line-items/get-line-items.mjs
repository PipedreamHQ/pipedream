import buysellads from "../../buysellads.app.mjs";

export default {
  key: "buysellads-get-line-items",
  name: "Get Line Items",
  description: "Returns the details of active line items. [See the documentation](https://docs.buysellads.com/advertiser-api/endpoints#lineitems)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    buysellads,
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
    const response = await this.buysellads.listLineItems({
      $,
      params: {
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

    $.export("$summary", `Successfully fetched ${length} line item${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
