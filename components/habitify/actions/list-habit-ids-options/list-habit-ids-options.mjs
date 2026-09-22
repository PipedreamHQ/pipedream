import habitify from "../../habitify.app.mjs";

export default {
  key: "habitify-list-habit-ids-options",
  name: "List Habit IDs Options",
  description: "Retrieves available options for the Habit IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    habitify,
  },
  async run({ $ }) {
    const options = await habitify.propDefinitions.habitIds.options.call(this.habitify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
