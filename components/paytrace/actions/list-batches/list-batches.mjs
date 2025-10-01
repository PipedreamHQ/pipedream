import paytrace from "../../paytrace.app.mjs";

export default {
  name: "List Batches by Date Range",
  description: "This method can be used to export a set of batch summary details with a provided date range. This method will return one or more batch summary records. [See docs here](https://developers.paytrace.com/support/home#14000045545)",
  key: "paytrace-list-batches",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paytrace,
    startDate: {
      propDefinition: [
        paytrace,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        paytrace,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paytrace.listBatches({
      $,
      data: {
        start_date: this.startDate,
        end_date: this.endDate,
      },
    });
    $.export("$summary", `${response.batches} batches has been retrieved`);
    return response;
  },
};
