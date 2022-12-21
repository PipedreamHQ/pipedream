import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-deal",
  name: "Create Deal",
  description: "Create a deal in Hubspot. [See the docs here](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=POST-/crm/v3/objects/deals)",
  version: "0.0.4",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
  },
};
