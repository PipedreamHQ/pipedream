import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../mews.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    deploy() {
      const {
        getLastDateAt,
        setLastDateAt,
        getInitialLookbackMs,
      } = this;
      if (!getLastDateAt()) {
        const initial = new Date(Date.now() - getInitialLookbackMs()).toISOString();
        setLastDateAt(initial);
      }
    },
  },
  methods: {
    // Override these in concrete sources
    getRequester() {
      throw new ConfigurationError("getRequester is not implemented");
    },
    getResultKey() {
      throw new ConfigurationError("getResultKey is not implemented");
    },
    getResourceName() {
      return "Resource";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      throw new ConfigurationError("getDateField is not implemented");
    },
    getDateFilterField() {
      // e.g. "CreatedUtc" | "UpdatedUtc" | "CanceledUtc"
      throw new ConfigurationError("getDateFilterField is not implemented");
    },
    getStaticFilters() {
      // e.g. { States: ["Cancelled"] }
      return {};
    },
    getInitialLookbackMs() {
      // three months ago
      return 3 * 30 * 24 * 60 * 60 * 1000;
    },
    getMaxRequests() {
      return 3;
    },
    setLastDateAt(value) {
      this.db.set("lastDateAt", value);
    },
    getLastDateAt() {
      return this.db.get("lastDateAt");
    },
    generateMeta(resource) {
      const id = this.getId(resource);
      const dateField = this.getDateField();
      const tsStr = resource?.[dateField] || new Date().toISOString();
      return {
        id,
        summary: `${this.getResourceName()} ${id}`,
        ts: Date.parse(tsStr),
      };
    },
  },
  async run() {
    const {
      app,
      getRequester,
      getResultKey,
      getDateField,
      getDateFilterField,
      getStaticFilters,
      getLastDateAt,
      setLastDateAt,
      generateMeta,
      getMaxRequests,
    } = this;

    const lastDateAt = getLastDateAt() || new Date(0).toISOString();

    const items = await app.paginate({
      requester: getRequester(),
      requesterArgs: {
        data: {
          ...getStaticFilters(),
          [getDateFilterField()]: {
            StartUtc: lastDateAt,
            EndUtc: new Date().toISOString(),
          },
        },
      },
      resultKey: getResultKey(),
      maxRequests: getMaxRequests(),
    });

    if (!items?.length) {
      return;
    }

    let maxTs = lastDateAt;
    items.forEach((resource) => {
      const meta = generateMeta(resource);
      const tsStr = resource?.[getDateField()] || new Date().toISOString();

      if (tsStr > maxTs) {
        maxTs = tsStr;
      }

      this.$emit(resource, meta);
    });

    setLastDateAt(maxTs);
  },
};
