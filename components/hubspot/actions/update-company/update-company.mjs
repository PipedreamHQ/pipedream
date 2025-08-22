import { OBJECT_TYPE } from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-company",
  name: "Update Company",
  description: "Update a company in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.20",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.COMPANY;
    },
  },
  props: {
    ...appProp.props,
    objectId: {
      propDefinition: [
        appProp.props.hubspot,
        "objectId",
        () => ({
          objectType: "company",
        }),
      ],
    },
    ...common.props,
  },
};
