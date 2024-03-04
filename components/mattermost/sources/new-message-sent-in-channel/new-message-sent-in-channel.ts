import mattermost from "../../app/mattermost.app";
import { SourceHttpRunOptions, defineSource } from "@pipedream/types";

export default defineSource({
  name: "New Message Sent in Channel",
  description:
    "Emit new event when a message matching the requirements is sent in a channel. [See the documentation](https://api.mattermost.com/#tag/webhooks/operation/CreateOutgoingWebhook)",
  key: "mattermost-new-message-sent-in-channel",
  version: "0.0.1",
  type: "source",
  props: {
    mattermost,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getSummary(item): string {
      return `New message: ${item}`;
    },
  },
  hooks: {
    async activate() {
      const data = {
        eventKey: this.getHookType(),
        hookUrl: this.http.endpoint,
      };

      const { key } = await this.infusionsoft.createHook(data);

      this.db.set("hookKey", key);
    },
    async deactivate() {
      const key: string = this.db.get("hookKey");

      await this.infusionsoft.deleteHook({
        key,
      });
    },
  },
  async run(data: SourceHttpRunOptions) {
    // const result = await Promise.all(promises);
    const result = [];data;
    result.forEach(({
      obj, response,
    }) => {
      const data = response.noUrl
        ? obj
        : response;
      const summary = this.getSummary(data);
      this.$emit(data, {
        id: obj.id,
        summary,
        ts: new Date(obj.timestamp).valueOf(),
      });
    });
  },
});
