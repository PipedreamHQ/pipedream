import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-custom-object",
  name: "Update Custom Object",
  description:
    "Update a custom object record in HubSpot by id. Set **Custom Object Type** (the object's `fullyQualifiedName`, e.g. `p_pets`) and **Object ID**, and put the fields to change in **Object Properties**. Example: Custom Object Type `p_pets`, Object ID `123`, Object Properties `{ \"birthday\": \"1993-06-12\" }`. Returns the updated record. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#update-existing-custom-objects)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
    getObjectType() {
      return this.customObjectType;
    },
  },
  props: {
    hubspot,
    customObjectType: {
      propDefinition: [
        hubspot,
        "customObjectType",
      ],
    },
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        (c) => ({
          objectType: c.customObjectType,
        }),
      ],
      description: "The ID of the custom object",
    },
    ...common.props,
  },
};
