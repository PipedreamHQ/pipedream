import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-custom-object",
  name: "Create Custom Object",
  description: "Create a new custom object in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#create-a-custom-object)",
  version: "0.0.2",
  type: "action",
  props: {
    hubspot,
    customObjectType: {
      propDefinition: [
        hubspot,
        "customObjectType",
      ],
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.customObjectType;
    },
  },
};
