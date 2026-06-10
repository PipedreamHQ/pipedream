import getprospect from "../../getprospect.app.mjs";

export default {
  key: "getprospect-list-list-ids-options",
  name: "List List IDs Options",
  description: "Retrieves available options for the List IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getprospect,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await getprospect.propDefinitions.listIds.options.call(this.getprospect, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
