import {
  ASSOCIATION_CATEGORY,
  OBJECT_TYPE,
} from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-lead",
  name: "Create Lead",
  description: "Create a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#create-leads)",
  version: "0.0.13",
  type: "action",
  props: {
    ...appProp.props,
    contactId: {
      propDefinition: [
        appProp.props.hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description: "The contact to associate with the lead",
    },
    ...common.props,
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
