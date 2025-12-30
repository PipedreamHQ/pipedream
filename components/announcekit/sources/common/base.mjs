import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../announcekit.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastItemId() {
      return this.db.get("lastItemId");
    },
    _setLastItemId(itemId) {
      this.db.set("lastItemId", itemId);
    },
    getVariables(variables) {
      return variables;
    },
    getFn() {
      return this.app.listActivities;
    },
    getItemsField() {
      return "activities";
    },
    async emitEvent(maxResults = false) {
      const lastItemId = this._getLastItemId();

      const response = this.app.paginate({
        fn: this.getFn(),
        variables: this.getVariables({
          projectId: this.projectId,
        }),
        maxResults,
        itemsField: this.getItemsField(),
      });

      let items = [];
      for await (const item of response) {
        if (item.id <= lastItemId) break;
        items.push(item);
      }

      if (items.length) {
        this._setLastItemId(items[0].id);
      }

      for (const item of items.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at),
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

