import uberduck from "../../uberduck.app.mjs";

export default {
  key: "uberduck-list-voicemodel-uuid-options",
  name: "List Voice Model UUID Options",
  description: "Retrieves available options for the Voice Model UUID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    uberduck,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await uberduck.propDefinitions.voicemodelUuid.options.call(this.uberduck, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
