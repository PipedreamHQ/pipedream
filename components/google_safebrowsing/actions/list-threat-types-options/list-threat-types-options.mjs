import google_safebrowsing from "../../google_safebrowsing.app.mjs";

export default {
  key: "google_safebrowsing-list-threat-types-options",
  name: "List Threat Types Options",
  description: "Retrieves available options for the Threat Types field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_safebrowsing,
  },
  async run({ $ }) {
    const options = await google_safebrowsing.propDefinitions.threatTypes.options
      .call(this.google_safebrowsing);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
