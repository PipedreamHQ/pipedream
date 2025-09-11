import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-custom-object",
  name: "Create Custom Object",
  description:
    "Create a new custom object in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#create-a-custom-object)",
  version: "1.0.11",
  type: "action",
  props: {
    ...appProp.props,
    customObjectType: {
      propDefinition: [
        appProp.props.hubspot,
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
