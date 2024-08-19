import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import airfocus from "../../airfocus.app.mjs";

export default {
  props: {
    airfocus,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        airfocus,
        "workspaceId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getInnerFilter({
      filterField, lastDate,
    }) {
      return [
        {
          type: filterField,
          mode: "afterOrOn",
          value: {
            date: lastDate,
            zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      ];
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const filterField = this.getFilterField();

      const response = this.airfocus.paginate({
        fn: this.airfocus.listItems,
        workspaceId: this.workspaceId,
        maxResults,
        data: {
          filter: {
            type: "and",
            inner: this.getInnerFilter({
              filterField,
              lastDate,
            }),
          },
          sort: {
            type: filterField,
            direction: "desc",
          },
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        const dateArray = responseArray[0][filterField].split( "T" );
        this._setLastDate(dateArray[0]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: `${item.id}-${item[filterField]}`,
          summary: this.getSummary(item),
          ts: Date.parse(item[filterField]),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
