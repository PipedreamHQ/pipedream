import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-or-update-contact",
  name: "Create or Update Contact",
  description:
    "Create a contact in HubSpot, or update it when one with the same email already exists (enable **Update If Exists**). Put contact fields in **Object Properties** as HubSpot internal names. Example: Object Properties `{ \"email\": \"ada@example.com\", \"firstname\": \"Ada\", \"jobtitle\": \"CTO\" }`. Returns the created or updated contact with its id. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    updateIfExists: {
      label: "Update If Exists",
      description:
        "Set to `true` to update the existing contact instead of failing when HubSpot rejects creation because the contact already exists (error category `CONFLICT` or `OBJECT_ALREADY_EXISTS`). Other creation errors are not retried as updates and still fail. Example: `true`.",
      type: "boolean",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
  },
};
