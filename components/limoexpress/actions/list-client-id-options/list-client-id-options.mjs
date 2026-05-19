import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-list-client-id-options",
  name: "List Client ID Options",
  description: "Retrieves available options for the Client ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    limoexpress,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await limoexpress.propDefinitions.clientId.options.call(this.limoexpress, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
