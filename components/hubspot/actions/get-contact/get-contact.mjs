import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-contact",
  name: "Get Contact",
  description: "Gets a contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts/{contactId})",
  version: "0.0.9",
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
