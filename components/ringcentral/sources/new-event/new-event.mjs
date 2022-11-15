import notificationTypes from "../common/notification-types.mjs";
import common from "../common/http-based.mjs";
import messageTypes from "../common/message-types.mjs";

export default {
  ...common,
  key: "ringcentral-new-event",
  name: "New Event (Instant)",
  description: "Emit new event for each notification from RingCentral of a specified type",
  version: "0.1.1",
  type: "source",
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
        ({ extensionId }) => ({
          extensionId,
        }),
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

        return notificationTypes.map(({
          label, key,
        }) => ({
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
    getPropValues() {
      return {
        extensionId: this.extensionId,
        deviceId: this.deviceId,
        messageType: messageTypes[0],
      };
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
