import { OBJECT_TYPE } from "../../common/constants.mjs";
import appProp from "../common/common-app-prop.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-contact",
  name: "Update Contact",
  description: "Update a contact in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "0.0.22",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
  },
  props: {
    ...appProp.props,
    objectId: {
      propDefinition: [
        appProp.props.hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
    },
    ...common.props,
  },
};
