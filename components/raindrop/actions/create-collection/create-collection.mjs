import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-create-collection",
  name: "Create New Collection",
  description: "Creates an additional collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#create-collection)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
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
    const title = this.title?.value ?? this.title;
    const sort = this.sort?.value ?? this.sort;
    const publicInput = this.public?.value ?? this.public;
    const parentId = this.parentID?.value ?? this.parentID;
    const view = this.view?.value ?? this.view;
    const cover = this.cover?.value ?? this.cover;

    const body = {
      title,
      sort,
      public: publicInput,
      parent: {
        $id: parentId,
      },
      view,
      cover,
    };
    const response = await this.raindrop.postCollection($, body);

    $.export("$summary", `Successfully created collection with ID ${response.item._id}`);

    return response;
  },
};
