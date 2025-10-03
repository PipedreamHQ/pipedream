import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import domo from "../../domo.app.mjs";

export default {
  key: "domo-new-data-in-card",
  name: "New Data in Domo Card",
  description: "Emit a new event when data within a specific Domo card is updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    domo: {
      type: "app",
      app: "domo",
    },
    db: {
      type: "$.service.db",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    cardId: {
      propDefinition: [
        domo,
        "cardId",
      ],
    },
    thresholds: {
      propDefinition: [
        domo,
        "thresholds",
      ],
      optional: true,
    },
    conditions: {
      propDefinition: [
        domo,
        "conditions",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        domo,
        "projectId",
      ],
    },
    listId: {
      propDefinition: [
        domo,
        "listId",
      ],
      optional: true,
    },
  },
  methods: {
    evaluateCondition(fieldValue, operator, value) {
      switch (operator) {
      case ">=":
        return fieldValue >= value;
      case "<=":
        return fieldValue <= value;
      case ">":
        return fieldValue > value;
      case "<":
        return fieldValue < value;
      case "==":
        return fieldValue == value;
      case "===":
        return fieldValue === value;
      case "!=":
        return fieldValue != value;
      case "!==":
        return fieldValue !== value;
      default:
        return false;
      }
    },
    shouldEmitEvent(currentData, lastData) {
      if (!lastData) {
        return true;
      }
      if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
        return true;
      }
      if (this.thresholds.length > 0 || this.conditions.length > 0) {
        for (const thresholdStr of this.thresholds) {
          try {
            const threshold = JSON.parse(thresholdStr);
            const {
              field, operator, value,
            } = threshold;
            const fieldValue = currentData[field];
            if (typeof fieldValue !== "undefined" && this.evaluateCondition(fieldValue, operator, value)) {
              return true;
            }
          } catch (error) {
            continue;
          }
        }
        for (const conditionStr of this.conditions) {
          try {
            const condition = JSON.parse(conditionStr);
            const {
              field, operator, value,
            } = condition;
            const fieldValue = currentData[field];
            if (typeof fieldValue !== "undefined" && this.evaluateCondition(fieldValue, operator, value)) {
              return true;
            }
          } catch (error) {
            continue;
          }
        }
      }
      return false;
    },
  },
  hooks: {
    async deploy() {
      try {
        const currentData = await this.domo.getCardData({
          cardId: this.cardId,
        });
        await this.db.set("lastData", currentData);
        if (Array.isArray(currentData)) {
          const eventsToEmit = currentData.slice(0, 50);
          for (const data of eventsToEmit) {
            const ts = data.updatedAt
              ? Date.parse(data.updatedAt)
              : Date.now();
            const id = data.id || ts;
            const summary = `Data updated for Card ID: ${this.cardId}`;
            this.$emit(data, {
              id,
              summary,
              ts,
            });
          }
        }
      } catch (error) {
        console.error("Error in deploy hook:", error);
      }
    },
    async activate() {
      // No action needed on activation for polling
    },
    async deactivate() {
      // No action needed on deactivation for polling
    },
  },
  async run() {
    try {
      const currentData = await this.domo.getCardData({
        cardId: this.cardId,
      });
      const lastData = await this.db.get("lastData");
      let shouldEmit = this.shouldEmitEvent(currentData, lastData);

      if (shouldEmit) {
        const ts = currentData.updatedAt
          ? Date.parse(currentData.updatedAt)
          : Date.now();
        const id = currentData.id || ts;
        const summary = `Data updated for Card ID: ${this.cardId}`;
        this.$emit(currentData, {
          id,
          summary,
          ts,
        });
        await this.db.set("lastData", currentData);
      }
    } catch (error) {
      console.error("Error in run method:", error);
    }
  },
};
