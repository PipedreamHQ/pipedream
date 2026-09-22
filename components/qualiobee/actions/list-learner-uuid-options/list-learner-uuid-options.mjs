import qualiobee from "../../qualiobee.app.mjs";

export default {
  key: "qualiobee-list-learner-uuid-options",
  name: "List Learner UUID Options",
  description: "Retrieves available options for the Learner UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    qualiobee,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await qualiobee.propDefinitions.learnerUuid.options.call(this.qualiobee, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
