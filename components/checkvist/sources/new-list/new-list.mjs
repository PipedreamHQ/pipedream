import checkvist from "../../checkvist.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "checkvist-new-list",
  name: "New List Created",
  description: "Emit new event when a new list is created in your Checkvist account. [See the documentation](https://checkvist.com/auth/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    checkvist,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const lists = await this.checkvist.getLists();
      lists.slice(0, 50).forEach((list) => this.emitList(list));
      if (lists.length) this._setLastListId(lists[0].id);
    },
  },
  methods: {
    emitList(list) {
      const ts = Date.parse(list.created_at) || Date.now();
      this.$emit(list, {
        id: list.id,
        summary: `New list: ${list.name}`,
        ts,
      });
    },
    _getLastListId() {
      return this.db.get("lastListId");
    },
    _setLastListId(lastListId) {
      this.db.set("lastListId", lastListId);
    },
  },
  async run() {
    const lastListId = this._getLastListId();
    const lists = await this.checkvist.getLists();
    const newLists = lastListId
      ? lists.filter((list) => list.id > lastListId)
      : lists;

    for (const list of newLists) {
      this.emitList(list);
    }

    if (newLists.length) {
      this._setLastListId(newLists[0].id);
    }
  },
};
