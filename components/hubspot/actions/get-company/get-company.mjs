import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-company",
  name: "Get Company",
  description: "Gets a company. [See the docs here](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=GET-/crm/v3/objects/companies/{companyId})",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    objectId: {
      ...common.props.objectId,
      label: "Company ID",
      description: "Hubspot's internal ID for the company",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
};
