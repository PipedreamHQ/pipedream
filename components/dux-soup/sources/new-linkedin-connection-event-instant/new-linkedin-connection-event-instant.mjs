import linkedin from "../../linkedin.app.mjs";

export default {
  key: "dux-soup-new-linkedin-connection-event-instant",
  name: "New LinkedIn Connection Event Instant",
  description: "Emit new event when a new LinkedIn connection is added. [See the documentation](https://developer.linkedin.com/docs/guide/v2/people/connections-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linkedin,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    targetProfileId: {
      propDefinition: [
        linkedin,
        "targetProfileId",
      ],
    },
    connectionInfo: {
      propDefinition: [
        linkedin,
        "connectionInfo",
      ],
      optional: true,
    },
    dateAdded: {
      propDefinition: [
        linkedin,
        "dateAdded",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const response = await this.linkedin.createWebhook(webhookUrl);
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.linkedin.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["x-linkedin-event-type"] !== "connection") {
      return;
    }

    const connectionId = body.id;
    const connection = await this.linkedin.getConnection(connectionId);
    this.$emit(connection, {
      id: connection.id,
      summary: `New LinkedIn connection: ${connection.firstName} ${connection.lastName}`,
      ts: Date.parse(connection.dateAdded),
    });
  },
};
