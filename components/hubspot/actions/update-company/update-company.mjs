import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-company",
  name: "Update Company",
  description:
    "Update a company in HubSpot by id. Set **Object ID** and put the fields to change in **Object Properties** as HubSpot internal names (only the fields you pass are modified). Look up the id with **Search CRM** if you only have a name. Example: Object ID `123`, Object Properties `{ \"phone\": \"555-0100\", \"industry\": \"BIOTECHNOLOGY\" }`. Returns the updated company. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies)",
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
      return OBJECT_TYPE.COMPANY;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "company",
        }),
      ],
    },
    ...common.props,
  },
};
