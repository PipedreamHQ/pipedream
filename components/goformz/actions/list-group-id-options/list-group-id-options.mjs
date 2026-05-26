import goformz from "../../goformz.app.mjs";

export default {
  key: "goformz-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    goformz,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await goformz.propDefinitions.groupId.options.call(this.goformz, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
