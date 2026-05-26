import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-list-tracker-id-options",
  name: "List Tracker ID Options",
  description: "Retrieves available options for the Tracker ID field.",
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
    const options = await redmine.propDefinitions.trackerId.options.call(this.redmine);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
