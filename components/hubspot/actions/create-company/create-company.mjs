import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-company",
  name: "Create Company",
  description:
    "Create a company in HubSpot. Put the company fields in **Object Properties** as a JSON object of HubSpot internal property names (use **Get Properties** for `companies` to discover them). Example: `{ \"name\": \"InGen\", \"domain\": \"ingen.com\", \"industry\": \"BIOTECHNOLOGY\" }`. Returns the created company with its id. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=POST-/crm/v3/objects/companies)",
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
      return OBJECT_TYPE.COMPANY;
    },
  },
};
