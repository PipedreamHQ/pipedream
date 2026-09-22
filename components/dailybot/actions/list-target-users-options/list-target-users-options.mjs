import dailybot from "../../dailybot.app.mjs";

export default {
  key: "dailybot-list-target-users-options",
  name: "List Target User IDs Options",
  description: "Retrieves available options for the Target User IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dailybot,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dailybot.propDefinitions.targetUsers.options.call(this.dailybot, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
