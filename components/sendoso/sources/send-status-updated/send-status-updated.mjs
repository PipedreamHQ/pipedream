import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Send Status Updated",
  key: "sendoso-send-status-updated",
  description: "Emit new event when a send status is updated. [See docs here](https://sendoso.docs.apiary.io/#reference/send-management/send-tracking/fetch-the-status-of-a-send)",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Sendoso API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    trackingId: {
      propDefinition: [
        common.props.sendoso,
        "trackingId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunc() {
      return this.sendoso.getSentGifts;
    },
    getDataToEmit({
      date_and_time, status,
    }) {
      return {
        id: date_and_time,
        summary: this.getSummary(status),
        ts: new Date().getTime(date_and_time),
      };
    },
    getFieldId() {
      return "date_and_time";
    },
    getSummary(status) {
      return `Send status updated to ${status}`;
    },
    async prepareData() {
      const { trackingId } = this;
      const { activities } = await this.sendoso.getSendStatus({
        trackingId,
      });

      return activities[0].map((activity) => ({
        ...activity.activity,
      }));
    },
    async proccessEvent() {
      const lastTime = this._getLastId();
      const activities = await this.prepareData();
      const list = activities.filter((item) => moment(item.date_and_time).isAfter(lastTime));

      await this.emitEvent(list);
    },
    async startRun() {
      const activities = await this.prepareData();
      if (activities.length > 20) activities.length = 20;
      await this.emitEvent(activities);
    },
  },
};

