import common from "../common/common-create-object.mjs";

const {
  hubspot, ...otherProps
} = common.props;

export default {
  ...common,
  key: "hubspot-create-custom-object",
  name: "Create Custom Object",
  description:
    "Create a custom object record in HubSpot. Set **Custom Object Type** to the object's `fullyQualifiedName` (e.g. `p_pets`; use **List Custom Object Schemas** to find it) and put fields in **Object Properties**. Example: Custom Object Type `p_pets`, Object Properties `{ \"pet_name\": \"Rexy\" }`. Returns the created record with its id. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#create-a-custom-object)",
  version: "2.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    hubspot,
    customObjectType: {
      propDefinition: [
        hubspot,
        "customObjectType",
      ],
    },
    ...otherProps,
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.customObjectType;
    },
  },
};
