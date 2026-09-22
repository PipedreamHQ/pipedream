import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-list-status-id-options",
  name: "List Status ID Options",
  description: "Retrieves available options for the Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    redmine,
  },
  async run({ $ }) {
    const options = await redmine.propDefinitions.statusId.options.call(this.redmine);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
