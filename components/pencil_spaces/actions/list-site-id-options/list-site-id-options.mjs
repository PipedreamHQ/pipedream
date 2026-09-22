import pencil_spaces from "../../pencil_spaces.app.mjs";

export default {
  key: "pencil_spaces-list-site-id-options",
  name: "List Site Id Options",
  description: "Retrieves available options for the Site Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pencil_spaces,
  },
  async run({ $ }) {
    const options = await pencil_spaces.propDefinitions.siteId.options.call(this.pencil_spaces);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
