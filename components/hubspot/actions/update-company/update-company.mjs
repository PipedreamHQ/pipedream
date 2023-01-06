import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-update-object.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  ...common,
  key: "hubspot-update-company",
  name: "Update Company",
  description: "Update a company in Hubspot. [See the docs here](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.3",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "company",
        }),
      ],
    },
    ...common.props,
  },
};
