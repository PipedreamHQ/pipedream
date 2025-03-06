import xss from "xss";

/**
 * Should support the following data types:
 * https://pipedream.com/docs/data-stores/#supported-data-types
 */

export default {
  type: "app",
  app: "data_stores",
  propDefinitions: {
    dataStore: {
      label: "Data Store",
      type: "data_store",
      description: "Select an existing Data Store or create a new one.",
    },
    key: {
      label: "Key",
      type: "string",
      description: "Key for the data you'd like to add or update. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
      async options({ dataStore }) {
        return dataStore.keys();
      },
    },
    value: {
      label: "Value",
      type: "any",
      description: "Enter a string, object, or array.",
    },
    ttl: {
      label: "Time to Live (TTL)",
      type: "integer",
      description: "The number of seconds until this record expires and is automatically deleted. Examples: 3600 (1 hour), 86400 (1 day), 604800 (1 week). Leave blank for records that should not expire.",
      optional: true,
      min: 0,
      max: 31536000, // 1 year (safe upper limit)
    },
    addRecordIfNotFound: {
      label: "Create a new record if the key is not found?",
      description: "Create a new record if no records are found for the specified key.",
      type: "string",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  methods: {
    // using Function approach instead of eval:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
    evaluate(value) {
      try {
        return Function(`"use strict"; return (${xss(value)})`)();
      } catch (err) {
        return value;
      }
    },
    parseJSON(value) {
      return JSON.parse(JSON.stringify(this.evaluate(value)));
    },
    shouldAddRecord(option) {
      return option === "Yes";
    },
    parseValue(value) {
      if (typeof value !== "string") {
        return value;
      }

      try {
        return this.parseJSON(value);
      } catch (err) {
        return value;
      }
    },
    formatTtl(seconds) {
      if (!seconds) return "";

      // Format TTL in a human-readable way
      if (seconds < 60) {
        return `${seconds} second${seconds === 1
          ? ""
          : "s"}`;
      }
      if (seconds < 3600) {
        const minutes = Math.round(seconds / 60);
        return `${minutes} minute${minutes === 1
          ? ""
          : "s"}`;
      }
      if (seconds < 86400) {
        const hours = Math.round(seconds / 3600);
        return `${hours} hour${hours === 1
          ? ""
          : "s"}`;
      }
      if (seconds < 604800) {
        const days = Math.round(seconds / 86400);
        return `${days} day${days === 1
          ? ""
          : "s"}`;
      }
      const weeks = Math.round(seconds / 604800);
      return `${weeks} week${weeks === 1
        ? ""
        : "s"}`;
    },
    async updateTtlIfNeeded(dataStore, key, ttl) {
      if (!ttl) return false;

      if (await dataStore.has(key)) {
        await dataStore.setTtl(key, ttl);
        return true;
      }
      return false;
    },
  },
};
