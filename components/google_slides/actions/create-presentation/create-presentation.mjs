import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-create-presentation",
  name: "Create Presentation",
  description: "Create a blank presentation or duplicate an existing presentation. [See the docs here](https://developers.google.com/slides/api/guides/presentations#copy_an_existing_presentation)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new presentation.",
    },
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
      description: "Select the presentation that you want to copy from.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.presentationId) {
      const presentation = await this.app.copyPresentation(this.presentationId, this.title);
      $.export("$summary", `Successfully copied presentation with ID: ${this.presentationId} to ${presentation.id}`);
      return presentation;
    }
    const presentation = await this.app.createPresentation(this.title);
    $.export("$summary", `Successfully created presentation with ID: ${presentation.presentationId}`);
    return presentation;
  },
};
