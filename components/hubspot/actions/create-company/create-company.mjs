import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-create-object.mjs";

export default {
  ...common,
  key: "hubspot-create-company",
  name: "Create Company",
  description: "Create a company in Hubspot. [See the docs here](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=POST-/crm/v3/objects/companies)",
  version: "0.0.2",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
};
