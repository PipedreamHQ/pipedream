import { OBJECT_TYPE } from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-deal",
  name: "Update Deal",
  description: "Update a deal in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/deals#update-deals)",
  version: "0.0.12",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
  },
  props: {
    ...appProp.props,
    objectId: {
      propDefinition: [
        appProp.props.hubspot,
        "objectId",
        () => ({
          objectType: "deal",
        }),
      ],
    },
    ...common.props,
  },
};
