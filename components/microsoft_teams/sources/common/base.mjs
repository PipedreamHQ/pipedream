import microsoftTeams from "../../microsoft_teams.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    microsoftTeams,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getTsField() {
      return "createdDateTime";
    },
    isNew(resource, lastDate, tsField) {
      if (!tsField || !resource[tsField] || !lastDate) {
        return true;
      }
      return Date.parse(resource[tsField]) > lastDate;
    },
    async getNewPaginatedResources(fn, params, lastDate, tsField, isSorted = false) {
      const resources = [];
      const paginator = this.paginate(fn, params);

      for await (const resource of paginator) {
        const isNewResource = this.isNew(resource, lastDate, tsField);
        if (isNewResource) {
          resources.push(resource);
        } else if (isSorted) {
          break;
        }
      }
      return resources;
    },
    async *paginate(fn, params) {
      let nextLink;
      do {
        const response = nextLink
          ? await this.microsoftTeams.clientApiGetRequest(nextLink)
          : await fn(params);

        for (const value of response.value) {
          yield value;
        }

        nextLink = response["@odata.nextLink"];
      } while (nextLink);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    async processEvents(max) {
      let lastDate = this._getLastDate();
      const tsField = this.getTsField();

      const resources = await this.getResources(lastDate, tsField);
      let items = [];
      for (const resource of resources) {
        const date = resource[tsField];
        if (!lastDate || (date && Date.parse(date) > lastDate)) {
          lastDate = Date.parse(date);
        }
        items.push(resource);
      }

      this._setLastDate(lastDate);

      if (max) {
        items = items.slice(0, max);
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
