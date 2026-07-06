import google_drive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-theme-id-options",
  name: "List Theme ID Options",
  description: "Retrieves available options for the Theme ID field.",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_drive,
  },
  async run({ $ }) {
    const options = await google_drive.propDefinitions.themeId.options.call(this.google_drive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
