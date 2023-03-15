import nethuntCrm from "../../nethunt_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    nethuntCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
  },
  methods: {
    _getSince() {
      return this.db.get("since");
    },
    _setSince(since) {
      this.db.set("since", since);
    },
  },
  async run() {
    const nextSince = new Date();
    const since = this._getSince();

    const data = await this.fetchData({
      folderId: this.folderId,
      params: {
        since,
      },
    });

    this._setSince(nextSince);
    this.emitEvents(data.reverse());
  },
};
