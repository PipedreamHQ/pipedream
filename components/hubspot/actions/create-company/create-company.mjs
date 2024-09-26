import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-company",
  name: "Create Company",
  description: "Create a company in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=POST-/crm/v3/objects/companies)",
  version: "0.0.12",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
};
