import helloleads from "../../helloleads.app.mjs";

export default {
  key: "helloleads-list-list-key-options",
  name: "List List Key Options",
  description: "Retrieves available options for the List Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helloleads,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await helloleads.propDefinitions.listKey.options.call(this.helloleads, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
