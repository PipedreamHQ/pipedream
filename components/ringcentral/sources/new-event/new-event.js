const notificationTypes = require("../common/notification-types");
const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-new-event",
  name: "New Event (Instant)",
  description: "Emits an event for each notification from RingCentral of a specified type",
  version: "0.0.1",
  props: {
    ...common.props,
    extensionId: {
      optional: true,
      propDefinition: [
        common.props.ringcentral,
        "extensionId",
      ],
    },
    deviceId: {
      optional: true,
      propDefinition: [
        common.props.ringcentral,
        "deviceId",
        c => ({ extensionId: c.extensionId }),
      ],
    },
    notificationTypes: {
      type: "string[]",
      label: "Notification Types",
      description: "The types of notifications to emit events for",
      options({ page = 0 }) {
        if (page !== 0) {
          return [];
        }

        return notificationTypes.map(({ label, key }) => ({
          label,
          value: key,
        }));
      },
    },
  },
  methods: {
    ...common.methods,
    _getEventTypeFromFilter(eventFilter) {
      return eventFilter
        .replace(/\/restapi\/v\d+\.\d+\//, "")
        .replace(/account\/.*?\//, "")
        .replace(/extension\/.*?\//, "");
    },
    getSupportedNotificationTypes() {
      return new Set(this.notificationTypes);
    },
    generateMeta(data) {
      const {
        uuid: id,
        timestamp,
        event: eventFilter,
      } = data;

      const eventType = this._getEventTypeFromFilter(eventFilter);
      const summary = `New event: ${eventType}`;
      const ts = Date.parse(timestamp);

      return {
        id,
        summary,
        ts,
      };
    },
  },
};
