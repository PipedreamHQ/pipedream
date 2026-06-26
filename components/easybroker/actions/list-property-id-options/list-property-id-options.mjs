import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-list-property-id-options",
  name: "List Property ID Options",
  description: "Retrieves available options for the Property ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easybroker,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await easybroker.propDefinitions.propertyId.options.call(this.easybroker, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
