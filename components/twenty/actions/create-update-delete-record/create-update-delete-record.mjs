import twenty from "../../twenty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "twenty-create-update-delete-record",
  name: "Create, Update, or Delete a Record in Twenty",
  description: "Create, update, or delete a single record in Twenty. This action allows for dynamic handling of records based on specified action type. [See the documentation](https://api.twenty.com/docs)",
  version: "0.0.1",
  type: "action",
  props: {
    twenty,
    recordId: {
      propDefinition: [
        twenty,
        "recordId",
      ],
    },
    recordData: {
      propDefinition: [
        twenty,
        "recordData",
      ],
    },
    actionType: {
      propDefinition: [
        twenty,
        "actionType",
      ],
    },
  },
  async run({ $ }) {
    const actionType = this.actionType || "create"; // Default to create if not specified
    let response;

    try {
      response = await this.twenty.performAction({
        actionType,
        recordId: this.recordId,
        recordData: this.recordData,
      });

      let summaryMessage = `Successfully performed ${actionType} action`;
      if (this.recordId) summaryMessage += ` on record with ID ${this.recordId}`;
      $.export("$summary", summaryMessage);

      return response;
    } catch (error) {
      throw new Error(`Failed to ${actionType} record. Error: ${error.message}`);
    }
  },
};
