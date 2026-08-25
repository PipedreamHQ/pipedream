// x-pd-ai: optimized
import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-contact",
  name: "Get Contact",
  description:
    "Get a single contact from HubSpot by its id, with a default set of contact properties. Add **Additional properties to retrieve** to include more (use **Get Properties** for `contacts`). Look up the id with **Search CRM** by email if you only have an address. Example: Object ID `123`, Additional properties `[\"jobtitle\"]`. Returns the contact record. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts/{contactId})",
  version: "0.1.0",
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
      label: "Contact ID",
      description: "Hubspot's internal ID for the contact",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
  },
};
