import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-list-tag-id-options",
  name: "List Tag ID Options",
  description: "Retrieves available options for the Tag ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    picqer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await picqer.propDefinitions.tagId.options.call(this.picqer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
