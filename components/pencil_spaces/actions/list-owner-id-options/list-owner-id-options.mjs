import pencil_spaces from "../../pencil_spaces.app.mjs";

export default {
  key: "pencil_spaces-list-owner-id-options",
  name: "List Owner Id Options",
  description: "Retrieves available options for the Owner Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pencil_spaces,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pencil_spaces.propDefinitions.ownerId.options.call(this.pencil_spaces, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
