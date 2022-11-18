import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import testmonitor from "../../testmonitor.app.mjs";

export default {
  props: {
    testmonitor,
    projectId: {
      propDefinition: [
        testmonitor,
        "projectId",
      ],
    },
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the TestMonitor API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDateTime() {
      return this.db.get("dateTime");
    },
    _setDateTime(dateTime) {
      this.db.set("dateTime", dateTime);
    },
    async processEvent({
      params, dateTime, func,
    }) {
      const items = this.testmonitor.paginate({
        fn: func,
        params,
      });

      for await (const item of items) {
        if (moment(item.created_at).isAfter(dateTime)) this._setDateTime(item.created_at);
        dateTime = item.created_at;
        this.$emit(item, this.getDataToEmit(item));
      }
    },
  },
  hooks: {
    async activate() {
      let dateTime = this._getLastDateTime();
      const func = this.getFunc();
      const params = {
        "project_id": this.projectId,
        "order[code]": "desc",
        "limit": 20,
      };

      if (dateTime) params["filter[created_at][start]"] = dateTime;

      const { data } = await func(params);

      for (const item of data) {
        if (!dateTime || moment(item.created_at).isAfter(dateTime)) {
          this._setDateTime(item.created_at);
          dateTime = item.created_at;
        }
        this.$emit(item, this.getDataToEmit(item));
      }
    },
  },
  async run() {
    const dateTime = this._getLastDateTime();
    const func = this.getFunc();

    const params = {
      "filter[created_at][start]": dateTime,
      "filter[created_at][end]": new Date(),
      "project_id": this.projectId,
      "order[code]": "desc",
    };

    return this.processEvent({
      params,
      dateTime,
      func,
    });
  },
};

