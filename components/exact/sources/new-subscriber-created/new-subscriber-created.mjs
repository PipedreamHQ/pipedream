import exact from "../../exact.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "exact-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event each time a new subscriber/account is created. [See the docs](https://start.exactonline.nl/docs/HlpRestAPIResourcesDetails.aspx?name=CRMAccounts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    exact,
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
      const {
        d: {
          results: [
            { CurrentDivision: currentDivision } = {},
          ] = [],
        },
      } = await this.exact.getDivision({
        params: {
          ["$select"]: "CurrentDivision",
        },
      });
      this._setDivision(currentDivision);

      const accounts = await this.exact.listAccounts(currentDivision);
      this.processAccounts(accounts.slice(-25));
    },
  },
  methods: {
    _getDivision() {
      return this.db.get("division");
    },
    _setDivision(division) {
      this.db.set("division", division);
    },
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getCreatedTs(account) {
      return account.Created.match(/\d+/)[0];
    },
    generateMeta(account) {
      return {
        id: account.ID,
        summary: account.Name,
        ts: this.getCreatedTs(account),
      };
    },
    processAccounts(accounts, lastCreated = 0) {
      let maxTs = lastCreated;
      for (const account of accounts) {
        const created = this.getCreatedTs(account);
        if (created > lastCreated) {
          const meta = this.generateMeta(account);
          this.$emit(account, meta);
        }
        if (created > maxTs) {
          maxTs = created;
        }
      }
      this._setLastCreated(maxTs);
    },
  },
  async run() {
    const division = this._getDivision();
    const lastCreated = this._getLastCreated();
    const accounts = await this.exact.listAccounts(division);
    this.processAccounts(accounts, lastCreated);
  },
};
