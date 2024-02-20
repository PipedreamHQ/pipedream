import tableau from "../../tableau.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "tableau-workbook-created-instant",
  name: "Workbook Created (Instant)",
  description: "Emits an event each time a new workbook is created in Tableau. [See the documentation](https://help.tableau.com/current/developer/webhooks/en-us/docs/webhooks-events-payload.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tableau,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    siteId: {
      propDefinition: [
        tableau,
        "siteId",
      ],
    },
    webhookName: {
      propDefinition: [
        tableau,
        "webhookName",
        (c) => ({
          webhookName: `pd_source_${c.tableau.$auth.oauth_access_token}_${Date.now()}`,
        }),
      ],
    },
    eventName: {
      propDefinition: [
        tableau,
        "eventName",
        () => ({
          eventName: "webhook-source-event-workbook-created",
        }),
      ],
    },
    webhookUrl: {
      propDefinition: [
        tableau,
        "webhookUrl",
        (c) => ({
          webhookUrl: c.http.endpoint,
        }),
      ],
    },
  },
  methods: {
    generateSignature(secret, body) {
      return crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("base64");
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the 50 most recent workbooks created
      const workbooks = await this.tableau.listProjects({
        siteId: this.siteId,
      });
      workbooks.slice(-50).forEach((workbook) => {
        this.$emit(workbook, {
          id: workbook.resource_luid,
          summary: `New workbook created: ${workbook.resource_name}`,
          ts: Date.parse(workbook.created_at),
        });
      });
    },
    async activate() {
      // Create a webhook in Tableau
      const {
        siteId, webhookName, eventName, webhookUrl,
      } = this;
      const webhookId = await this.tableau.createWebhook({
        siteId,
        webhookName,
        eventName,
        webhookUrl,
      });

      // Store the webhook ID in the component's state
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Retrieve the stored webhook ID
      const webhookId = this.db.get("webhookId");

      // Delete the webhook in Tableau
      if (webhookId) {
        await this.tableau.deleteWebhook({
          siteId: this.siteId,
          webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming webhook signature
    const signature = headers["tableau-webhook-signature"];
    const secret = this.tableau.$auth.oauth_access_token;
    const computedSignature = this.generateSignature(secret, JSON.stringify(body));

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.resource_luid,
      summary: `New workbook created: ${body.resource_name}`,
      ts: Date.parse(body.created_at),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: {
        message: "Webhook received",
      },
    });
  },
};
