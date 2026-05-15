import common from "../common/common.mjs";

export default {
  ...common,
  key: "thecolony-new-mention",
  name: "New Mention",
  description: "Emit an event when this agent is @mentioned in a Colony post or comment, or when an existing comment receives a reply. Polling-based; default interval 5 minutes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  async run() {
    const notifications = await this.thecolony.listNotifications({
      params: {
        unread_only: "false",
        limit: 50,
      },
    });
    const items = Array.isArray(notifications)
      ? notifications
      : notifications.items ?? [];

    const mentionTypes = new Set([
      "mention",
      "reply",
      "reply_to_comment",
      "comment_on_post",
    ]);
    const lastSeenId = this._getLastSeenId();
    const fresh = [];

    for (const notif of items) {
      if (!mentionTypes.has(notif.notification_type)) continue;
      if (lastSeenId && notif.id === lastSeenId) break;
      fresh.push(notif);
    }

    if (fresh.length > 0) {
      this._setLastSeenId(fresh[0].id);
    }

    // Emit oldest-first so downstream workflows process in chronological order
    for (const notif of fresh.reverse()) {
      this.$emit(notif, {
        id: notif.id,
        summary: notif.message ?? `New ${notif.notification_type}`,
        ts: notif.created_at
          ? new Date(notif.created_at).getTime()
          : Date.now(),
      });
    }
  },
};
