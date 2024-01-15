import { axios } from "@pipedream/platform";
import stannp from "../../stannp.app.mjs";

export default {
  key: "stannp-new-recipient-created",
  name: "New Recipient Created",
  description: "Emits an event when a new recipient is created in a group. [See the documentation](https://www.stannp.com/us/direct-mail-api/recipients)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    stannp,
    db: "$.service.db",
    groupId: {
      propDefinition: [
        stannp,
        "groupId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getRecipientId() {
      return this.db.get("recipientId") || null;
    },
    _setRecipientId(recipientId) {
      this.db.set("recipientId", recipientId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch all recipients to backfill events
      let lastRecipientId = this._getRecipientId();
      const { data: recipients } = await this.stannp.listGroups({
        groupId: this.groupId,
      });

      if (recipients.length === 0) {
        console.log("No recipients found during deploy.");
        return;
      }

      // Sort by ID descending
      recipients.sort((a, b) => b.id - a.id);

      // Store the latest ID for the next run
      this._setRecipientId(recipients[0].id);

      // Emit at most 50 events in order of most recent to least recent
      const eventsToEmit = recipients.slice(0, 50);
      for (const recipient of eventsToEmit) {
        this.$emit(recipient, {
          id: recipient.id,
          summary: `New Recipient: ${recipient.firstname} ${recipient.lastname}`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    let lastRecipientId = this._getRecipientId();
    const { data: recipients } = await this.stannp.listGroups({
      groupId: this.groupId,
    });

    // Filter out already processed recipients and sort by ID descending
    const newRecipients = recipients
      .filter((recipient) => recipient.id > lastRecipientId)
      .sort((a, b) => b.id - a.id);

    if (newRecipients.length === 0) {
      console.log("No new recipients found.");
      return;
    }

    // Store the latest ID for the next run
    this._setRecipientId(newRecipients[0].id);

    for (const recipient of newRecipients) {
      this.$emit(recipient, {
        id: recipient.id,
        summary: `New Recipient: ${recipient.firstname} ${recipient.lastname}`,
        ts: Date.now(),
      });
    }
  },
};
