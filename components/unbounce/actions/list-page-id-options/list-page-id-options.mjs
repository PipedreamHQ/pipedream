import unbounce from "../../unbounce.app.mjs";

export default {
  key: "unbounce-list-page-id-options",
  name: "List Page Id Options",
  description: "Retrieves available options for the Page Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unbounce,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await unbounce.propDefinitions.pageId.options.call(this.unbounce, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
