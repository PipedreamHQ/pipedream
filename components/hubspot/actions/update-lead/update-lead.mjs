import { OBJECT_TYPE } from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-lead",
  name: "Update Lead",
  description: "Update a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#update-leads)",
  version: "0.0.12",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.LEAD;
    },
  },
  props: {
    ...appProp.props,
    objectId: {
      propDefinition: [
        appProp.props.hubspot,
        "leadId",
      ],
    },
    ...common.props,
  },
};
