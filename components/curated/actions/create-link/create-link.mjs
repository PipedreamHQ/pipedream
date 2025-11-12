import curated from "../../curated.app.mjs";

export default {
  name: "Create Link",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "curated-create-link",
  description: "Creates a link. [See docs here](https://support.curated.co/help/managing-links-with-the-api#h_9993192972131638320427148)",
  type: "action",
  props: {
    curated,
    publicationId: {
      propDefinition: [
        curated,
        "publicationId",
      ],
    },
    url: {
      label: "URL",
      description: "The URL for the collected link.",
      type: "string",
    },
    title: {
      label: "Title",
      description: "The title of the collected link.",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "A description for the collected link.",
      type: "string",
      optional: true,
    },
    imageURL: {
      label: "Image URL",
      description: "A URL for an image to upload.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.curated.createLink({
      $,
      publicationId: this.publicationId,
      data: {
        url: this.url,
        title: this.title,
        description: this.description,
        image: this.imageURL,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created link with id ${response.id}`);
    }

    return response;
  },
};
