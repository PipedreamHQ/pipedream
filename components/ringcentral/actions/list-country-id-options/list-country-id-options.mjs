import ringcentral from "../../ringcentral.app.mjs";

export default {
  key: "ringcentral-list-country-id-options",
  name: "List Country ID Options",
  description: "Retrieves available options for the Country ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ringcentral,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ringcentral.propDefinitions.countryId.options.call(this.ringcentral, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
