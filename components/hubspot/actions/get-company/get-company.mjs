import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-company",
  name: "Get Company",
  description:
    "Get a single company from HubSpot by its id, with a default set of company properties. Add **Additional properties to retrieve** (internal names; use **Get Properties** for `companies`) to include more. Example: Object ID `123`, Additional properties `[\"industry\", \"numberofemployees\"]`. Returns the company record. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=GET-/crm/v3/objects/companies/{companyId})",
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
      label: "Company ID",
      description: "Hubspot's internal ID for the company",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
};
