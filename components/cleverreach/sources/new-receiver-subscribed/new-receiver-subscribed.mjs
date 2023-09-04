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
    setToken(token) {
      this.db.set("token", token);
    },
    getToken() {
      return this.db.get("token");
    },
  },
  hooks: {
    async activate() {
      const token = Math.random().toString(36)
        .slice(2)
        .padStart(10, "a");
      this.setToken(token);
      const data = {
        url: this.http.endpoint,
        event: this.getEvent(),
        verify: token,
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
      body, method, query,
    } = event;
    if (method === "GET") {
      console.log("received GET, responding");
      const token = this.getToken();

      this.http.respond({
        status: 200,
        body: `${token} ${query.secret}`,
      });
    } else if (method === "POST") {
      console.log("received POST");
      this.$emit(body, {
        id: body.data.id,
        summary: `New subscriber: ${body.data.email}`,
        ts: Date.parse(body.data.created_at),
      });
    }
  },
};
