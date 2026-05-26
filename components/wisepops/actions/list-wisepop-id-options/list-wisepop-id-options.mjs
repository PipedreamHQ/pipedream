import wisepops from "../../wisepops.app.mjs";

export default {
  key: "wisepops-list-wisepop-id-options",
  name: "List Wisepop Id Options",
  description: "Retrieves available options for the Wisepop Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wisepops,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await wisepops.propDefinitions.wisepopId.options.call(this.wisepops, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
