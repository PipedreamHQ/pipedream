// x-pd-ai: optimized
import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-contact",
  name: "Update Contact",
  description:
    "Update a contact in HubSpot by id. Set **Object ID** and put the fields to change in **Object Properties** as HubSpot internal names (only the fields you pass are modified). If you don't have the id, look it up first with **Search CRM** (by email, or by name). Example: Object ID `123`, Object Properties `{ \"jobtitle\": \"Chief Paleontologist\" }`. Returns the updated contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=PATCH-/crm/v3/objects/contacts/{contactId})",
  version: "1.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
    },
    ...common.props,
  },
};
