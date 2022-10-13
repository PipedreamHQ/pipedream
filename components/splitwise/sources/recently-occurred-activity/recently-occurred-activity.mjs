import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "splitwise-recently-occurred-activity",
  name: "Recently Occurred Activity",
  description: "Emit new event for every recent activity on the users account. [See docs here](https://dev.splitwise.com/#tag/notifications/paths/~1get_notifications/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    db: "$.service.db",
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
        base.props.splitwise,
        "datedAfter",
      ],
      description: "ISO 8601 Datetime. Return notifications after this date.",
    },
  },
  methods: {
    ...base.methods,
    removeHtmlTags(text) {
      const regex = new RegExp(constants.HTML_TAGS.join("|"), "g");
      return text.replace(regex, "");
    },
  },
  async run() {
    const allowedTypes = this.types || [];

    console.log("Retrieving recent activities...");

    const notifications = (await this.splitwise.getNotifications({
      params: {
        updated_after: this.updatedAfter,
      },
    })).filter(({ type }) => allowedTypes.includes(type));

    this.logEmitEvent(notifications);

    for (const notification of notifications) {
      this.$emit(notification, {
        id: notification.id,
        summary: this.removeHtmlTags(notification.content),
        ts: new Date(notification.created_at),
      });
    }
  },
};
