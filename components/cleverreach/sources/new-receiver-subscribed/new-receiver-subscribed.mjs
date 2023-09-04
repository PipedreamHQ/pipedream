import app from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-new-subscriber-added",
  name: "New Subscriber Added",
  description: "Emit new event when a new subscriber is added. [See docs here](https://rest.cleverreach.com/howto/webhooks.php)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
      optional: true,
      description: "The group (mailing list) to watch for new subscribers",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    getEvent() {
      return "receiver.subscribed";
    },
  },
  hooks: {
    async deploy() {
      const data = {
        url: this.http.endpoint,
        event: this.getEvent(),
      };
      if (this.groupId) {
        data.condition = this.groupId;
      }
      await this.app.createWebhook(data);
    },
    async deactivate() {
      const event = this.getEvent();
      await this.app.deleteWebhook(event);
    },
  },
  async run(event) {
    const {
      method, body,
    } = event;
    if (method === "GET") {
      this.http.respond({
        status: 200,
      });
    } else if (method === "POST") {
      this.$emit(body, {
        id: body.data.id,
        summary: `New subscriber: ${body.data.email}`,
        ts: Date.parse(body.data.created_at),
      });
    }
  },
};
