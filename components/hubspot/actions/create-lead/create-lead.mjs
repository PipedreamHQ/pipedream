import {
  ASSOCIATION_CATEGORY, OBJECT_TYPE,
} from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

const {
  hubspot, ...otherProps
} = common.props;

export default {
  ...common,
  key: "hubspot-create-lead",
  name: "Create Lead",
  description:
    "Create a lead in HubSpot associated with an existing contact. Set **Contact ID** (the contact to link) and put lead fields in **Object Properties** as HubSpot internal names. Example: Contact ID `12345`, Object Properties `{ \"hs_lead_name\": \"Isla Nublar Opportunity\" }`. Returns the created lead with its id. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#create-leads)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    hubspot,
    contactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description: "The contact to associate with the lead",
    },
    ...otherProps,
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.LEAD;
    },
    createObject(opts) {
      return this.hubspot.createObject({
        ...opts,
        data: {
          ...opts?.data,
          associations: [
            {
              types: [
                {
                  associationCategory: ASSOCIATION_CATEGORY.HUBSPOT_DEFINED,
                  associationTypeId: 578, // ID for "Lead with Primary Contact"
                },
              ],
              to: {
                id: this.contactId,
              },
            },
          ],
        },
      });
    },
  },
};
