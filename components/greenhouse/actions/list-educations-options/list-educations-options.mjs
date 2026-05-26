import greenhouse from "../../greenhouse.app.mjs";

export default {
  key: "greenhouse-list-educations-options",
  name: "List Educations Options",
  description: "Retrieves available options for the Educations field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    greenhouse,
  },
  async run({ $ }) {
    const options = await greenhouse.propDefinitions.educations.options.call(this.greenhouse);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
