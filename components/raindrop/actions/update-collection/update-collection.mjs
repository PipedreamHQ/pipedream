import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-update-collection",
  name: "Update Collection",
  description: "Update an existing collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#update-collection)",
  version: "0.0.5",
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
    expanded: {
      propDefinition: [
        raindrop,
        "expanded",
      ],
    },
    title: {
      propDefinition: [
        raindrop,
        "title",
      ],
    },
    sort: {
      propDefinition: [
        raindrop,
        "sort",
      ],
    },
    public: {
      propDefinition: [
        raindrop,
        "public",
      ],
    },
    parentId: {
      propDefinition: [
        raindrop,
        "collectionId",
      ],
      optional: true,
      label: "Parent ID",
      description: "The ID of parent collection. Empty for root collections",
    },
    view: {
      propDefinition: [
        raindrop,
        "view",
      ],
    },
    cover: {
      propDefinition: [
        raindrop,
        "cover",
      ],
    },
  },
  async run({ $ }) {
    const {
      collectionId,
      expanded,
      title,
      sort,
      view,
      cover,
    } = this;
    const parentId = this.parentId;
    const publicInput = this.public;

    const body = {
      expanded,
      title,
      sort,
      public: publicInput,
      parent: {
        $id: parentId,
      },
      view,
      cover,
    };
    const response = await this.raindrop.putCollection($, collectionId, body);

    $.export("$summary", `Successfully updated collection with ID ${collectionId}`);

    return response;
  },
};
