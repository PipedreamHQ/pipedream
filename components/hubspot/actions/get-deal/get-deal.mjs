import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-deal",
  name: "Get Deal",
  description:
    "Get a single deal from HubSpot by its id, with a default set of deal properties. Add **Additional properties to retrieve** to include more (use **Get Properties** for `deals`). Example: Object ID `123`, Additional properties `[\"amount\", \"dealstage\"]`. Returns the deal record. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=GET-/crm/v3/objects/deals/{dealId})",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    objectId: {
      ...common.props.objectId,
      label: "Deal ID",
      description: "Hubspot's internal ID for the deal",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.DEAL;
    },
  },
};
