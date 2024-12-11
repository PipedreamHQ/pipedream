import common from "../common/common-update-object.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  ...common,
  key: "hubspot-update-custom-object",
  name: "Update Custom Object",
  description: "Update a custom object in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#update-existing-custom-objects)",
  version: "0.0.2",
  type: "action",
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
