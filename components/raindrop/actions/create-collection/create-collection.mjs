import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-create-collection",
  name: "Create New Collection",
  description: "Creates an additional collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#create-collection)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      title,
      sort,
      view,
      cover,
    } = this;
    const publicInput = this.public;
    const parentId = this.parentId;

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
