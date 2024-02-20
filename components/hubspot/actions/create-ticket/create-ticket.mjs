import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-ticket",
  name: "Create Ticket",
  description: "Create a ticket in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/tickets)",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.TICKET;
    },
  },
};
