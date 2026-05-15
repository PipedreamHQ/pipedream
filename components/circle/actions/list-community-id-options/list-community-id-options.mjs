import circle from "../../circle.app.mjs";

export default {
  key: "circle-list-community-id-options",
  name: "List Community ID Options",
  description: "Retrieves available options for the Community ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    circle,
  },
  async run({ $ }) {
    const options = await circle.propDefinitions.communityId.options.call(this.circle);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
