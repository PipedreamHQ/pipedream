import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import visitor_queue from "../../visitor_queue.app.mjs";

export default {
  key: "visitor_queue-new-lead",
  name: "New Lead",
  description: "Emit new event when a new Waiver sign is received. [See docs here](https://docs.visitorqueue.com/#4f021159-baae-e19d-bb7f-91a915e5b4ea)",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  props: {
    visitor_queue,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Visitor Queue API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    dataViews: {
      propDefinition: [
        visitor_queue,
        "dataViews",
      ],
    },
  },
  methods: {
    _getLastTime() {
      return this.db.get("lastTime");
    },
    _setLastTime(lastTime) {
      this.db.set("lastTime", lastTime);
    },
    getDataToEmit({
      id, name, last_visited_at,
    }) {
      return {
        id,
        summary: `New lead (${name})`,
        ts: new Date(last_visited_at).getTime(),
      };
    },
    async processEvent({
      params, lastTime,
    }) {
      const records = this.visitor_queue.paginate({
        fn: this.visitor_queue.listLeads,
        params,
      });

      for await (const record of records) {
        if (moment(record.last_visited_at).isAfter(lastTime))
          this._setLastTime(record.last_visited_at);

        this.$emit(record, this.getDataToEmit(record));
      }
    },
  },
  hooks: {
    async deploy() {
      const lastTime = this._getLastTime();
      const leads = await this.visitor_queue.listLeads({
        params: {
          ga_view_id: this.dataViews,
          min_date: lastTime,
          per_page: 20,
        },
      });

      for (const lead of leads) {
        if (!lastTime || moment(lastTime).isAfter(lead.last_visited_at)) {
          this._setLastTime(lead.last_visited_at);
        }
        this.$emit(lead, this.getDataToEmit(lead));
      }
    },
  },
  async run() {
    const lastTime = this._getLastTime();
    const params = {
      ga_view_id: this.dataViews,
      min_date: lastTime,
    };

    return this.processEvent({
      params,
      lastTime,
    });
  },
};
