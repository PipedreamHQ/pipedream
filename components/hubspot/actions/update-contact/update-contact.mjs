import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-contact",
  name: "Update Contact",
  description:
    "Update a contact in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
  version: "0.0.28",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
