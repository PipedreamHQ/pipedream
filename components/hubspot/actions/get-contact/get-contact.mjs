import { ObjectType } from "../../common/constants.mjs";
import common from "../common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-contact",
  name: "Get Contact",
  description: "Gets a contact",
  version: "0.0.1",
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
      return ObjectType.CONTACT;
    },
  },
};
