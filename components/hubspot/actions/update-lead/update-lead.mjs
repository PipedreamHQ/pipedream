import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-update-object.mjs";
import appProp from "../common/common-app-prop.mjs";

export default {
  ...common,
  key: "hubspot-update-lead",
  name: "Update Lead",
  description: "Update a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#update-leads)",
  version: "0.0.4",
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
