import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-update-collection",
  name: "Update Collection",
  description: "Update an existing collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#update-collection)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
    collectionID: {
      propDefinition: [
        raindrop,
        "collectionID",
      ],
      label: "Collection ID",
      description: "The collection ID",
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
    parentID: {
      propDefinition: [
        raindrop,
        "collectionID",
      ],
      optional: true,
      label: "Parent ID",
      description: "The ID of parent collection. Empty for root collections",
      withLabel: true,
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
      collectionID,
      expanded,
      title,
      sort,
      view,
      cover,
    } = this;
    const parentId = this.parentID;
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
    const response = await this.raindrop.putCollection($, collectionID, body);

    $.export("$summary", `Successfully updated collection with ID ${collectionID}`);

    return response;
  },
};
