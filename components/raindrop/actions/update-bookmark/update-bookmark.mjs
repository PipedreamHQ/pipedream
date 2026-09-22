import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-update-bookmark",
  name: "Update Bookmark",
  description: "Update an existing bookmark. [See the docs here](https://developer.raindrop.io/v1/raindrops/single#update-raindrop)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    raindrop,
    collectionId: {
      propDefinition: [
        raindrop,
        "collectionId",
      ],
    },
    bookmarkId: {
      propDefinition: [
        raindrop,
        "raindropId",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
    order: {
      type: "integer",
      label: "Order",
      description: "Specify sort order (ascending). For example if you want to move raindrop to the first place set this field to 0",
      optional: true,
    },
    important: {
      type: "boolean",
      label: "Important",
      description: "Flag bookmark as important",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags associated with this bookmark",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Bookmark title",
      optional: true,
    },
    link: {
      type: "string",
      label: "Link",
      description: "Bookmark URL",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      bookmarkId,
      order,
      important,
      tags,
      title,
      link,
    } = this;

    const body = {
      order,
      important,
      tags,
      title,
      link,
    };
    const response = await this.raindrop.putBookmark($, bookmarkId, body);

    $.export("$summary", `Successfully updated bookmark with ID ${bookmarkId}`);

    return response;
  },
};
