import google_drive from "../../google_drive.app.mjs";

export default {
  key: "google_drive-list-mime-type-options",
  name: "List Mime Type Options",
  description: "Retrieves available options for the Mime Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    google_drive,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await google_drive.propDefinitions.mimeType.options.call(this.google_drive, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
