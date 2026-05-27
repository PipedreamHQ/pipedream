import google_meet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-list-color-id-options",
  name: "List Color ID Options",
  description: "Retrieves available options for the Color ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_meet,
  },
  async run({ $ }) {
    const options = await google_meet.propDefinitions.colorId.options.call(this.google_meet);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
