import clockwork_recruiting from "../../clockwork_recruiting.app.mjs";

export default {
  key: "clockwork_recruiting-list-person-id-options",
  name: "List Person Id Options",
  description: "Retrieves available options for the Person Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockwork_recruiting,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await clockwork_recruiting.propDefinitions.personId.options
      .call(this.clockwork_recruiting, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
