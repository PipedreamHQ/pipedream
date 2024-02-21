import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-contact",
  name: "Create Contact",
  description: "Create a contact in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "0.0.10",
  type: "action",
  props: {
    ...common.props,
    updateIfExists: {
      label: "Update If Exists",
      description: "When selected, if Hubspot returns an error upon creation the resource should be updated.",
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
