import snappy from "../../snappy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    snappy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        snappy,
        "accountId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      throw Error("emitEvent is not implemented", data);
    },
    async getResources(args = {}) {
      throw Error("getResources is not implemented", args);
    },
    _setLastDateSynced(date) {
      this.db.set("lastDateSynced", date);
    },
    _getLastDateSynced() {
      return this.db.get("lastDateSynced");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResources({
        accountId: this.accountId,
        mailboxId: this.mailboxId,
      });

      resources.slice(-10).reverse()
        .forEach(this.emitEvent);

      this._setLastDateSynced(new Date().getTime());
    },
  },
  async run() {
    const lastDateSynced = this._getLastDateSynced() ?? new Date().getTime();
    this._setLastDateSynced(new Date().getTime());

    const resources = await this.getResources({
      accountId: this.accountId,
      mailboxId: this.mailboxId,
    });

    resources
      .filter((resource) => resource.created_at * 1000 > lastDateSynced)
      .reverse()
      .forEach(this.emitEvent);

    if (resources.length) {
      const createdAt = new Date(typeof resources[0].created_at === "string"
        ? resources[0].created_at
        : resources[0].created_at * 1000);
      this._setLastDateSynced(createdAt.getTime());
    }
  },
};
