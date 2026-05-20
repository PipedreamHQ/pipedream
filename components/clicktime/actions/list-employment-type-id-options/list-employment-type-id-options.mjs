import clicktime from "../../clicktime.app.mjs";

export default {
  key: "clicktime-list-employment-type-id-options",
  name: "List Employment Type ID Options",
  description: "Retrieves available options for the Employment Type ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clicktime,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await clicktime.propDefinitions.employmentTypeId.options.call(this.clicktime, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
