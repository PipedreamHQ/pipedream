import kontentAi from "../../kontent_ai.app.mjs";

export default {
  key: "kontent_ai-create-content-item",
  name: "Create Content Item",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new content item based on a specific content type. [See the documentation](https://kontent.ai/learn/docs/apis/openapi/management-api-v2/#operation/add-a-content-item)",
  type: "action",
  props: {
    kontentAi,
    name: {
      type: "string",
      label: "Name",
      description: "The content item's display name.",
    },
    codename: {
      type: "string",
      label: "Codename",
      description: "If not defined, it is [initially generated](https://kontent.ai/learn/docs/apis/openapi/management-api-v2/#section/Rules-for-codenames) from the item's **name** and can later be modified.",
      optional: true,
    },
    typeId: {
      propDefinition: [
        kontentAi,
        "typeId",
      ],
    },
    collectionId: {
      propDefinition: [
        kontentAi,
        "collectionId",
      ],
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The content item's external ID. The external ID can be used as a unique identifier to retrieve content from a different system.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      kontentAi,
      typeId,
      collectionId,
      externalId,
      ...data
    } = this;

    let collection = {};
    if (collectionId) {
      collection = {
        collection: {
          id: collectionId,
        },
      };
    }

    const { data: response } = await kontentAi.createContentItem({
      ...data,
      type: {
        id: typeId,
      },
      ...collection,
      externalId,
    });

    $.export("$summary", `A new content item with Id: ${response.id} was successfully created!`);
    return response;
  },
};
