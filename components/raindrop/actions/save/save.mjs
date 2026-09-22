import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-save",
  name: "Save to Raindrop Collection",
  description: "Receive a link and save it into a specified collection. [See docs](https://developer.raindrop.io/v1/raindrops/single)",
  version: "1.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    raindrop,
    link: {
      type: "string",
      label: "Bookmark Link",
      description: "Link of the bookmark to save",
    },
    collectionId: {
      propDefinition: [
        raindrop,
        "collectionId",
      ],
      description: "The Collection ID. Default collection is `Unsorted`",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Bookmark Tags",
      description: "A list of tags for the bookmark",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the bookmark",
      optional: true,
    },
    excerpt: {
      type: "string",
      label: "Excerpt",
      description: "Description of the bookmark",
      optional: true,
    },
  },
  async run({ $ }) {
    const bookmarkData = {
      link: this.link,
      collection: {
        $id: this.collectionId,
      },
      tags: this.tags ?? [],
      title: this.title,
      excerpt: this.excerpt,
    };

    const response = await this.raindrop.postBookmark($, bookmarkData);
    $.export("$summary", "Bookmark saved");
    return response;
  },
};
