import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-find-presentation",
  name: "Find a Presentation",
  description: "Find a presentation on Google Drive. [See the docs here](https://developers.google.com/slides/api/samples/presentation#list_existing_presentation_files)",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
      description: "The drive to select a presentation from. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    presentationId: {
      propDefinition: [
        app,
        "presentationId",
        (c) => ({
          driveId: app.methods.getDriveId(c.drive),
        }),
      ],
      description: "List of presentations in the specified drive",
    },
  },
  async run({ $ }) {
    const presentation = await this.app.getPresentation(this.presentationId);
    $.export("$summary", `Successfully found presentation with ID: ${presentation.presentationId}`);
    return presentation;
  },
};
