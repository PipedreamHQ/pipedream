import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-media",
  name: "Create Media",
  description: "Create a new media object from a direct upload. [See the documentation](https://developer.surecart.com/api-reference/medias/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    directUploadSignedId: {
      type: "string",
      label: "Direct Upload Signed ID",
      description: "The `signed_id` returned from a direct upload request. Example: `eyJfc...`",
    },
    alt: {
      type: "string",
      label: "Alt Text",
      description: "HTML `alt` attribute for the media. Example: `Product front view`",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "HTML `title` attribute for the media. Example: `Blue Widget`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createMedia({
      $,
      data: {
        media: {
          direct_upload_signed_id: this.directUploadSignedId,
          alt: this.alt,
          title: this.title,
        },
      },
    });
    $.export("$summary", `Successfully created media ${response.id}`);
    return response;
  },
};
