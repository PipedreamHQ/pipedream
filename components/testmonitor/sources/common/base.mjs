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
    _setLastDateTime(dateTime) {
      this.db.set("dateTime", dateTime);
    },
    async processEvent(item) {
      const meta = this.getDataToEmit(item);
      this.$emit(item, meta);
    },
  },
  hooks: {
    async activate() {
      let dateTime = this._getLastDateTime();
      const func = this.getFunc();
      const orderField = this.getOrderField();
      const params = {
        "project_id": this.projectId,
        [`order[${orderField}]`]: "desc",
        "limit": 20,
      };

      if (dateTime) params["filter[created_at][start]"] = dateTime;

      const { data } = await func(params);

      for (const item of data) {
        if (!dateTime || moment(item.created_at).isAfter(dateTime)) {
          this._setLastDateTime(item.created_at);
          dateTime = item.created_at;
        }
        this.processEvent(item);
      }
    },
  },
  async run() {
    let dateTime = this._getLastDateTime();
    const func = this.getFunc();
    const orderField = this.getOrderField();

    const params = {
      "filter[created_at][start]": dateTime,
      "project_id": this.projectId,
      [`order[${orderField}]`]: "desc",
    };

    const items = this.testmonitor.paginate({
      fn: func,
      params,
    });

    for await (const item of items) {
      if (moment(item.created_at).isAfter(dateTime)) this._setLastDateTime(item.created_at);
      dateTime = item.created_at;
      this.processEvent(item);
    }
  },
};

