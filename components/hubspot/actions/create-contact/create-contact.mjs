import { ObjectType } from "../../common/constants.mjs";
import common from "../common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-contact",
  name: "Create Contact",
  description: "Create a contact in Hubspot",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return ObjectType.CONTACT;
    },
  },
};
