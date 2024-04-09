import timing from "../../timing.app.mjs";

export default {
  key: "timing-new-time-entry",
  name: "New Time Entry",
  description: "Emits an event each time a new time entry is created in Timing",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    timing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    userCredentials: {
      type: "object",
      label: "User Credentials",
      description: "User credentials",
      required: true,
    },
    timeEntryInfo: {
      type: "object",
      label: "Time Entry Info",
      description: "Information about the time entry",
      optional: true,
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after");
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    generateMeta(data) {
      const {
        id, start_date,
      } = data;
      const summary = `New Time Entry: ${id}`;
      const ts = Date.parse(start_date);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const after = this._getAfter();
    const params = after
      ? {
        after,
      }
      : {};

    const { data } = await this.timing._makeRequest({
      method: "GET",
      path: "/time-entries",
      params,
    });

    if (data.length > 0) {
      const {
        id, start_date, end_date, project, title, notes,
      } = data[0];
      this.$emit(
        {
          id,
          start_date,
          end_date,
          project,
          title,
          notes,
        },
        this.generateMeta(data[0]),
      );

      this._setAfter(Date.parse(end_date));
    }
  },
};
