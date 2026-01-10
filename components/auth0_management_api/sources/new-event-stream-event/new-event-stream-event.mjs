import auth0 from "../../auth0_management_api.app.mjs";
import events from "../common/events.mjs";

export default {
  key: "auth0_management_api-new-event-stream-event",
  name: "New Event Stream Event (Instant)",
  description: "Emit new event when a new webhook event is received from an Auth0 event stream. [See the documentation](https://auth0.com/docs/api/management/v2/event-streams/post-event-streams)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    auth0,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event stream",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The event type to subscribe to",
      options: events,
    },
    token: {
      type: "string",
      secret: true,
      label: "Token",
      description: "An authentication token to use for the webhook authentication",
    },
  },
  hooks: {
    async activate() {
      const response = await this.auth0.createEventStream({
        data: {
          name: this.name,
          subscriptions: [
            {
              event_type: this.eventType,
            },
          ],
          destination: {
            type: "webhook",
            configuration: {
              webhook_endpoint: this.http.endpoint,
              webhook_authorization: {
                method: "bearer",
                token: this.token,
              },
            },
          },
          status: "enabled",
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.auth0.deleteEventStream({
          id,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New ${body.type} event`,
        ts: Date.parse(body.time),
      };
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (!body) {
      return;
    }

    const { authorization } = headers;
    if (authorization !== `Bearer ${this.token}`) {
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body));
  },
};
