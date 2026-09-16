import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-lead",
  name: "Update Lead",
  description:
    "Update a lead in HubSpot by id. Set **Object ID** and put the fields to change in **Object Properties** as HubSpot internal names. Look up the id with **Search CRM** if you only have a name. Example: Object ID `123`, Object Properties `{ \"hs_lead_name\": \"Site B Expansion - Priority\" }`. Returns the updated lead. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#update-leads)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.LEAD;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "leadId",
      ],
    },
    ...common.props,
  },
};
