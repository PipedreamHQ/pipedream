import lightspeed_vt from "../../lightspeed_vt.app.mjs";

export default {
  key: "lightspeed_vt-list-content-role-options",
  name: "List Content Role Id Options",
  description: "Retrieves available options for the Content Role Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lightspeed_vt,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await lightspeed_vt.propDefinitions.contentRole.options
      .call(this.lightspeed_vt, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
