import dailybot from "../../dailybot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dailybot-new-form-response-completed-instant",
  name: "New Form Response Completed Instant",
  description: "Emit new event when a response is added to a form in DailyBot by any user from your organization or an external user.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dailybot,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    organizationId: {
      propDefinition: [
        dailybot,
        "organizationId",
      ],
    },
    formId: {
      propDefinition: [
        dailybot,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for fetching and emitting historical data if applicable
      console.log("Deploy hook is running. Fetch and emit historical data if applicable.");
    },
    async activate() {
      // Placeholder for webhook subscription logic
      console.log("Activate hook is running. Subscribe to form response events.");
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic
      console.log("Deactivate hook is running. Unsubscribe from form response events.");
    },
  },
  async run(event) {
    const { body } = event;
    const formIdInEvent = body.formId;
    const organizationIdInEvent = body.organizationId;

    // Assuming the webhook body contains the form response information
    if (formIdInEvent === this.formId && organizationIdInEvent === this.organizationId) {
      const responseId = body.id; // Assuming the response has an ID. Adjust the property path according to the actual event structure.
      const summary = `New response for form ID ${this.formId}`;
      const ts = Date.now(); // Using the current timestamp. Adjust according to the actual event structure if a timestamp is provided.

      this.$emit(body, {
        id: responseId,
        summary,
        ts,
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Form ID or Organization ID does not match",
      });
    }
  },
};
