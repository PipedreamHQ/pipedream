import constants from "../../constants.mjs";
import zendesk from "../../zendesk.app.mjs";

export default {
  name: "New Ticket",
  key: "zendesk-new-issue",
  type: "source",
  description: "Emit new event when a ticket is created",
  version: "0.0.1",
  props: {
    zendesk,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const data = {
        webhook: {
          endpoint: this.http.endpoint,
          http_method: "POST",
          name: "Test Webhook",
          status: "active",
          request_format: "json",
          subscriptions: [
            "conditional_ticket_events",
          ],
          authentication: {
            type: "bearer_token",
            data: {
              token: "{token}",
            },
            add_position: "header",
          },
        },
      };

      const { webhook } = await this.zendesk.createWebhook({
        data,
      });

      console.log("webhook", webhook);
      const { id: webhookId } = webhook;

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();

      await this.zendesk.deleteWebhook({
        webhookId,
      });
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOKID, webhookId);
    },
    getWebhookId() {
      this.db.get(constants.WEBHOOKID);
    },
  },
  async run(event) {
    // const { headers } = event;

    // // Reject any calls not made by the proper BitBucket webhook.
    // if (!this._isValidSource(headers, this.db)) {
    //   this.http.respond({
    //     status: 404,
    //   });
    //   return;
    // }

    // // Acknowledge the event back to BitBucket.
    // this.http.respond({
    //   status: 200,
    // });

    // return await this.processEvent(event);
  },
};
