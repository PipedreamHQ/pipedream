import richpanel from "../../richpanel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "richpanel-create-ticket",
  name: "Create Ticket",
  description: "Creates a new support ticket in Richpanel. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    richpanel,
    id: {
      propDefinition: [
        richpanel,
        "createId",
      ],
    },
    status: {
      propDefinition: [
        richpanel,
        "createStatus",
      ],
    },
    commentBody: {
      propDefinition: [
        richpanel,
        "createCommentBody",
      ],
    },
    commentSenderType: {
      propDefinition: [
        richpanel,
        "createCommentSenderType",
      ],
    },
    viaChannel: {
      propDefinition: [
        richpanel,
        "createViaChannel",
      ],
    },
    viaSourceFrom: {
      propDefinition: [
        richpanel,
        "createViaSourceFrom",
      ],
    },
    viaSourceTo: {
      propDefinition: [
        richpanel,
        "createViaSourceTo",
      ],
    },
    tags: {
      propDefinition: [
        richpanel,
        "createTags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.richpanel.createTicket();

    $.export("$summary", `Created ticket ${response.id}`);
    return response;
  },
};
