import splitwise from "../../splitwise.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "splitwise-recently-occurred-activity",
  name: "Recently Occurred Activity",
  description: "Emit new event for every recent activity on the users account. [See docs here](https://dev.splitwise.com/#tag/notifications/paths/~1get_notifications/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    splitwise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    types: {
      type: "integer[]",
      label: "Notification Types",
      description: "The type value that indicates what the notification is about. [More info here](https://dev.splitwise.com/#tag/notifications/paths/~1get_notifications/get)",
      options: constants.NOTIFICATION_TYPES.map((label, index) => ({
        label,
        value: index,
      })),
      default: [],
    },
    updatedAfter: {
      propDefinition: [
        splitwise,
        "datedAfter",
      ],
      description: "ISO 8601 Datetime. Return notifications after this date.",
    },
  },
  methods: {
    removeHtmlTags(text) {
      const regex = new RegExp(constants.HTML_TAGS.join("|"), "g");
      return text.replace(regex, "");
    },
  },
  async run() {
    const allowedTypes = this.types || [];

    const notifications = await this.splitwise.getNotifications({
      params: {
        updated_after: this.updatedAfter,
      },
    });

    notifications
      .filter(({ type }) => allowedTypes.includes(type))
      .forEach((notification) => {
        this.$emit(notification, {
          id: notification.id,
          summary: this.removeHtmlTags(notification.content),
          ts: new Date(notification.created_at),
        });
      });
  },
};
