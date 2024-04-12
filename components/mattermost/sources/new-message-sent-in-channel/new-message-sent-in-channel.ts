import mattermost from "../../app/mattermost.app";
import {
  SourceHttpRunOptions, defineSource,
} from "@pipedream/types";

export default defineSource({
  name: "New Message Sent in Channel (Instant)",
  description:
    "Emit new event when a message matching the requirements is sent in a channel. [See the documentation](https://api.mattermost.com/#tag/webhooks/operation/CreateOutgoingWebhook)",
  key: "mattermost-new-message-sent-in-channel",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    mattermost,
    db: "$.service.db",
    http: "$.interface.http",
    teamId: {
      propDefinition: [
        mattermost,
        "teamId",
      ],
    },
    channelId: {
      propDefinition: [
        mattermost,
        "publicChannelId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The display name of the webhook in Mattermost",
      optional: true,
      default: "Pipedream source",
    },
    triggerWords: {
      type: "string[]",
      label: "Trigger Words",
      description: "List of words that will trigger an event",
    },
    triggerWhen: {
      type: "integer",
      label: "Trigger When",
      description: "When to trigger an event",
      optional: true,
      options: [
        {
          label: "When a trigger word is present in the message",
          value: 0,
        },
        {
          label: "If the message starts with a trigger word",
          value: 1,
        },
      ],
    },
  },
  methods: {
    _getWebhookId(): string {
      return this.db.get("webhookId");
    },
    _setWebhookId(value: string) {
      this.db.set("webhookId", value);
    },
  },
  hooks: {
    async activate() {
      const data = {
        team_id: this.teamId,
        channel_id: this.channelId,
        display_name: this.displayName,
        description: `Pipedream - New Message Sent in Channel ${this.channelId}`,
        trigger_words: this.triggerWords,
        trigger_when: this.triggerWhen,
        callback_urls: [
          this.http.endpoint,
        ],
        content_type: "application/json",
      };

      const { id } = await this.mattermost.createWebhook(data);
      this._setWebhookId(id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.mattermost.deleteWebhook(id);
    },
  },
  async run({ body }: SourceHttpRunOptions) {
    if (body) {
      const ts = Date.now();
      this.$emit(body, {
        id: typeof body.id === "string"
          ? body.id
          : ts,
        summary: "New message",
        ts,
      });
    }
  },
});
