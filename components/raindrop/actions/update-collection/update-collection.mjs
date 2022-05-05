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
    const collectionID = this.collectionID?.value ?? this.collectionID;
    const expanded = this.expanded?.value ?? this.expanded;
    const title = this.title?.value ?? this.title;
    const sort = this.sort?.value ?? this.sort;
    const publicInput = this.public?.value ?? this.public;
    const parentId = this.parentID?.value ?? this.parentID;
    const view = this.view?.value ?? this.view;
    const cover = this.cover?.value ?? this.cover;

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
