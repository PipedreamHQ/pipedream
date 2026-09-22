import little_green_light from "../../little_green_light.app.mjs";

export default {
  key: "little_green_light-list-appeal-id-options",
  name: "List Appeal ID Options",
  description: "Retrieves available options for the Appeal ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    little_green_light,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await little_green_light.propDefinitions.appealId.options
      .call(this.little_green_light, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
