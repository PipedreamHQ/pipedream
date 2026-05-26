import add_to_calendar_pro from "../../add_to_calendar_pro.app.mjs";

export default {
  key: "add_to_calendar_pro-list-cta-template-id-options",
  name: "List CTA Template ID Options",
  description: "Retrieves available options for the CTA Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    add_to_calendar_pro,
  },
  async run({ $ }) {
    const options = await add_to_calendar_pro.propDefinitions.ctaTemplateId.options
      .call(this.add_to_calendar_pro);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
