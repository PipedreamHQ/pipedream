import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-deal",
  name: "Update Deal",
  description:
    "Update a deal in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/deals#update-deals)",
  version: "0.0.17",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "deal",
        }),
      ],
    },
    ...common.props,
  },
};
