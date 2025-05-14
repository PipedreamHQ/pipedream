import mailosaur from "../../mailosaur.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailosaur-new-email-matching-criteria",
  name: "New Email Matching Criteria",
  description: "Emit new event when an email matching specific criteria is received. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    mailosaur,
    db: "$.service.db",
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    sentFrom: {
      type: "string",
      label: "Sent From",
      description: "The email address from which the target message was sent.",
      optional: true,
    },
    sentTo: {
      type: "string",
      label: "Sent To",
      description: "The email address to which the target message was sent.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line to search within the target email.",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The value to seek within the target message’s body.",
      optional: true,
    },
    receiveAfter: {
      type: "string",
      label: "Receive After",
      description: "Limits results to only messages received after this date/time.",
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const criteria = this._buildCriteria();
      const messages = await this.mailosaur.paginate(
        this.mailosaur.searchMessages,
        {
          serverId: this.serverId,
          receiveAfter: this.receiveAfter,
          ...criteria,
        },
      );

      messages.slice(0, 50).forEach((message) => {
        this.$emit(message, {
          id: message.id,
          summary: `New email from: ${message.from?.[0]?.email}`,
          ts: Date.parse(message.received),
        });
      });
    },
  },
  methods: {
    _getLastMessageId() {
      return this.db.get("lastMessageId") || null;
    },
    _setLastMessageId(id) {
      this.db.set("lastMessageId", id);
    },
    _buildCriteria() {
      return {
        ...(this.sentFrom && {
          sentFrom: this.sentFrom,
        }),
        ...(this.sentTo && {
          sentTo: this.sentTo,
        }),
        ...(this.subject && {
          subject: this.subject,
        }),
        ...(this.body && {
          body: this.body,
        }),
      };
    },
  },
  async run() {
    const criteria = this._buildCriteria();
    const messages = await this.mailosaur.paginate(
      this.mailosaur.searchMessages,
      {
        serverId: this.serverId,
        receiveAfter: this.receiveAfter,
        ...criteria,
      },
    );

    for (const message of messages) {
      if (message.id === this._getLastMessageId()) break;

      this.$emit(message, {
        id: message.id,
        summary: `New email from: ${message.from?.[0]?.email}`,
        ts: Date.parse(message.received),
      });

      this._setLastMessageId(message.id);
    }
  },
};
