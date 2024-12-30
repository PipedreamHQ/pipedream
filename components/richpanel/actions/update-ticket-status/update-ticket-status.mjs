import richpanel from "../../richpanel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "richpanel-update-ticket-status",
  name: "Update Ticket Status",
  description: "Updates the status of an existing ticket in Richpanel. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    richpanel,
    updateTicketId: {
      propDefinition: [
        richpanel,
        "updateTicketId",
      ],
    },
    updateStatus: {
      propDefinition: [
        richpanel,
        "updateStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.richpanel.updateTicketStatus();
    $.export("$summary", `Updated ticket ${this.updateTicketId} to status ${this.updateStatus}`);
    return response;
  },
};
