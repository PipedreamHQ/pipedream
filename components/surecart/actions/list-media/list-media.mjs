import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-media",
  name: "List Media",
  description: "Return a list of media items. [See the documentation](https://developer.surecart.com/api-reference/medias/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    publicAccess: {
      type: "boolean",
      label: "Public Access",
      description: "Filter by access setting. Set to `true` to return only publicly accessible media, or `false` for private media.",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listMedia,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "public_access": this.publicAccess,
        },
      },
      max: this.maxResults,
    });

    const mediaItems = [];
    for await (const mediaItem of results) {
      mediaItems.push(mediaItem);
    }

    $.export("$summary", `Successfully retrieved ${mediaItems.length} media item(s)`);
    return mediaItems;
  },
};
