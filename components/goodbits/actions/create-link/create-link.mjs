import app from "../../goodbits.app.mjs";

export default {
  key: "goodbits-create-link",
  name: "Create Link",
  description: "Create a new link. [See the documentation](https://support.goodbits.io/article/115-goodbit-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    fetchRemoteThumbnailUrl: {
      propDefinition: [
        app,
        "fetchRemoteThumbnailUrl",
      ],
    },
    imageCandidates: {
      propDefinition: [
        app,
        "imageCandidates",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createLink({
      $,
      data: {
        url: this.url,
        title: this.title,
        description: this.description,
        fetch_remote_thumbnail_url: this.fetchRemoteThumbnailUrl,
        image_candidates: this.imageCandidates,
      },
    });
    $.export("$summary", "Successfully created new link");
    return response;
  },
};
