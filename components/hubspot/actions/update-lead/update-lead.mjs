import { OBJECT_TYPE } from "../../common/constants.mjs";
import hubspot from "../../hubspot.app.mjs";
import common from "../common/common-update-object.mjs";

export default {
  ...common,
  key: "hubspot-update-lead",
  name: "Update Lead",
  description:
    "Update a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#update-leads)",
  version: "0.0.19",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.LEAD;
    },
  },
  props: {
    hubspot,
    objectId: {
      propDefinition: [
        hubspot,
        "leadId",
      ],
    },
    ...common.props,
  },
};
