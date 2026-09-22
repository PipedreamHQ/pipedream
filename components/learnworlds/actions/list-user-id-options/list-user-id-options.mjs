import learnworlds from "../../learnworlds.app.mjs";

export default {
  key: "learnworlds-list-user-id-options",
  name: "List User Id Options",
  description: "Retrieves available options for the User Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    learnworlds,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await learnworlds.propDefinitions.userId.options.call(this.learnworlds, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
