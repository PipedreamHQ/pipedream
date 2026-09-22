import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-list-customer-external-id-options",
  name: "List Customer External ID Options",
  description: "Retrieves available options for the Customer External ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    chaser,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await chaser.propDefinitions.customerExternalId.options.call(this.chaser, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
