import dailybot from "../../dailybot.app.mjs";

export default {
  key: "dailybot-new-check-in-response-completed-instant",
  name: "New Check-In Response Completed (Instant)",
  description: "Emit new event when a user from your organization completes a response to a check-in in DailyBot.",
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
  },
  hooks: {
    async activate() {
      // Placeholder for webhook subscription logic if applicable
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic if applicable
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "",
    });

    const { body } = event;
    if (!body || !body.data) {
      console.log("No data found in the webhook event");
      return;
    }

    const responseData = body.data;
    if (responseData.organization_id !== this.organizationId) {
      console.log("Check-in response completed event is not for the specified organization. Skipping...");
      return;
    }

    responseData.forEach((response) => {
      const {
        id, user, responseCompletedAt,
      } = response;
      this.$emit(response, {
        id,
        summary: `Check-in response completed by ${user.name} for organization ${this.organizationId}`,
        ts: Date.parse(responseCompletedAt),
      });
    });
  },
};
