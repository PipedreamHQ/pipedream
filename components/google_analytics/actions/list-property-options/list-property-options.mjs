import google_analytics from "../../google_analytics.app.mjs";

export default {
  key: "google_analytics-list-property-options",
  name: "List Property Options",
  description: "Retrieves available options for the Property field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_analytics,
  },
  async run({ $ }) {
    const options = await google_analytics.propDefinitions.property.options
      .call(this.google_analytics);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
