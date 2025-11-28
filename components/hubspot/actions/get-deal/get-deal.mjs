import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-deal",
  name: "Get Deal",
  description:
    "Gets a deal. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=GET-/crm/v3/objects/deals/{dealId})",
  version: "0.0.28",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
