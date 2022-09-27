import qstash from "../../qstash.app.mjs";
import { methods } from "../../common.mjs";

export default {
  name: "New Topic Webhook",
  version: "0.0.1",
  key: "qstash-new-topic-webhook",
  description: "Emit new events on each new QStash topic message",
  props: {
    qstash,
    topicId: {
      type: "string",
      label: "QStash Topic",
      description: "The QStash topic to subscribe to.",
      async options() {
        const topics = await this.qstash.listTopics({
          $: this,
        });

        return topics.map((topic) => ({
          label: topic.name,
          value: topic.topicId,
        }));
      },
    },
    http: {
      type: "$.interface.http",
      customResponse: true, // optional: defaults to false
    },
    db: "$.service.db",
  },
  type: "source",
  methods: {
    ...methods,
  },
  hooks: {
    async deploy() {
      console.log("deployment hook started");
      console.log("selected topic ID", this.topicId);
      console.log(`PD generated endpoint URL ${this.http.endpoint}`);
      const endpoint = await this.qstash.createEndpoint({
        $: this,
        topicId: this.topicId,
        endpointUrl: this.http.endpoint,
      });
      console.log("Created endpoint", endpoint);
      this.db.set("endpointId", endpoint.endpointId);
    },
    async deactivate() {
      console.log("deactivate hook started");
      const endpointId = this.db.get("endpointId");
      await this.qstash.deleteEndpoint({
        $: this,
        endpointId,
      });
      console.log(`Deleted QStash endpoint ${endpointId}`);
    },
    async activate() {
      console.log("activate hook started");

      const keys = await this.qstash.getKeys({
        $: this,
      });

      const currentSigningKey = keys.current;
      const nextSigningKey = keys.next;

      this.db.set("currentSigningKey", currentSigningKey);
      this.db.set("nextSigningKey", nextSigningKey);
      console.log("Set QStash signing keys");
    },
  },
  async run(event) {
    const signature = event.headers["upstash-signature"];
    const currentSigningKey = this.db.get("currentSigningKey");
    const nextSigningKey = this.db.get("nextSigningKey");
    const url = event.url.slice(0, -1);

    try {
      await this.verify(signature, currentSigningKey, event.rawBody, url);
    } catch (e) {
      console.log(e);
      await this.verify(signature, nextSigningKey, event.rawBody, url);
    }

    await this.$emit(
      {
        event,
      },
      {
        id: event.headers["upstash-signature"],
        summary: "New webhook received from QStash",
        ts: Date.now(),
      },
    );

    await this.http.respond({
      status: 200,
    });
  },
};
