import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-deal",
  name: "Update Deal",
  description:
    "Update a deal in HubSpot by id. Set **Object ID** and put the fields to change in **Object Properties** as HubSpot internal names. Look up the id with **Search CRM** if you only have a name. Example: Object ID `123`, Object Properties `{ \"dealstage\": \"closedwon\", \"amount\": \"90000\" }`. Returns the updated deal. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/deals#update-deals)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
