import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-list-tag-ids-options",
  name: "List Tag IDs Options",
  description: "Retrieves available options for the Tag IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cloudpresenter,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await cloudpresenter.propDefinitions.tagIds.options.call(this.cloudpresenter, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
