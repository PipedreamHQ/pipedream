import fraudlabsProApp from "../../fraudlabs_pro.app.mjs";

export default {
  name: "Status Changed (Instant)",
  description: "Emit new events when the status of an order changes in FraudLabs Pro.",
  version: "0.0.1",
  key: "fraudlabs_pro-status-changed",
  type: "source",
  props: {
    fraudlabsProApp,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      // 1. Check if a webhook already exists in the DB to prevent duplicates
      const existingHookId = this._getHookId();
      if (existingHookId) {
        console.log(`Webhook already active with ID: ${existingHookId}`);
        return;
      }

      const response = await this.fraudlabsProApp.webhookSubscribe({
        data: {
          url: this.http.endpoint,
          event: "status_changed",
          description: "Pipedream Workflow Trigger",
        },
      });

      if (!response?.id) {
        throw new Error("Webhook activation failed");
      }

      // Store the ID returned by FraudLabs Pro
      this._setHookId(response.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) return;

      await this.fraudlabsProApp.webhookUnsubscribe({
        params: {
          id: hookId,
        },
      });

      // Clear the DB so it can be re-activated later
      this._setHookId(null);
    },
  },
  async run(event) {
    // 2. Capture the incoming POST data from the API
    const body = event.body;
    if (!body || typeof body !== "object") {
      this.http.respond({
        status: 400,
        body: {
          message: "Invalid payload",
        },
      });
      return;
    }

    // Emit the data so it can be used in workflow steps
    // We use fields like order_id as the primary ID for deduplication in Pipedream
    this.$emit(body, {
      summary: `New Status: ${body.flp_status} for Order #${body.order_id}`,
      id: `${body.order_id}-${body.flp_status}-${body.updated_at ?? body.timestamp ?? Date.now()}`,
      ts: Date.now(),
    });

    // Acknowledge the receipt to FraudLabs Pro
    this.http.respond({
      status: 200,
      body: {
		  message: "Success",
	  },
    });
  },
};
