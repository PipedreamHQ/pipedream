import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-merge-data",
  name: "Merge Data",
  description: "Merge data into a presentation. [See the docs here](https://developers.google.com/slides/api/guides/merge)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Select the presentation to make a copy of.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new presentation.",
    },
    placeholdersAndTexts: {
      type: "object",
      label: "Placeholders And Texts",
      description: "The placeholders and texts to be merged into the presentation. So the key should be the placeholder ID and the value should be the text to be merged. As a placeholder example you can use `{{name}}` and the value can be `John Doe`.",
    },
    placeholdersAndImageUrls: {
      type: "object",
      label: "Placeholders And Image URLs",
      description: "The placeholders and image URLs to be merged into the presentation. So the key should be the placeholder ID and the value should be the image URL to be merged. As a placeholder example you can use `{{image}}` and the value can be `https://example.com/image.jpg`.",
      optional: true,
    },
  },
  methods: {
    getTextRequests(placeholdersAndTexts = {}) {
      return Object.entries(placeholdersAndTexts)
        .map(([
          key,
          value,
        ]) => ({
          replaceAllText: {
            containsText: {
              text: key,
              matchCase: true,
            },
            replaceText: value,
          },
        }));
    },
    getImageRequests(placeholdersAndImageUrls = {}) {
      return Object.entries(placeholdersAndImageUrls)
        .map(([
          key,
          value,
        ]) => ({
          replaceAllShapesWithImage: {
            imageUrl: value,
            replaceMethod: "CENTER_INSIDE",
            containsText: {
              text: key,
              matchCase: true,
            },
          },
        }));
    },
    batchUpdate(args = {}) {
      const slides = this.app.slides();
      return slides.presentations.batchUpdate(args);
    },
  },
  async run({ $ }) {
    const {
      app,
      batchUpdate,
      presentationId,
      title,
      placeholdersAndTexts,
      placeholdersAndImageUrls,
      getTextRequests,
      getImageRequests,
    } = this;

    const presentation = await app.copyPresentation(presentationId, title);

    const { data: response } = await batchUpdate({
      presentationId: presentation.id,
      resource: {
        requests: [
          ...getTextRequests(placeholdersAndTexts),
          ...getImageRequests(placeholdersAndImageUrls),
        ],
      },
    });

    $.export("$summary", `Successfully merged data into presentation with ID: ${response.presentationId}`);

    return response;
  },
};
