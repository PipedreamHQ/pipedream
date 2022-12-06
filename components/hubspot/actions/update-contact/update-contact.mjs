import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common-update-object.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  ...common,
  key: "hubspot-update-contact",
  name: "Update Contact",
  description: "Update a contact in Hubspot. [See the docs here](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "0.0.2",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.CONTACT;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
    },
    ...common.props,
  },
};
