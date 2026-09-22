import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-list-gage-id-options",
  name: "List Gage ID Options",
  description: "Retrieves available options for the Gage ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gagelist,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await gagelist.propDefinitions.gageId.options.call(this.gagelist, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
