import { axios } from "@pipedream/platform";
import affinity from "../../affinity.app.mjs";

export default {
  key: "affinity-field-value-changes",
  name: "Field Value Changes",
  description: "Emit new event when a field value changes",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    affinity,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    fieldName: {
      propDefinition: [
        affinity,
        "fieldName",
      ],
    },
    newValue: {
      propDefinition: [
        affinity,
        "newValue",
      ],
    },
    previousValue: {
      propDefinition: [
        affinity,
        "previousValue",
      ],
      optional: true,
    },
  },
  methods: {
    _getPreviousValue() {
      return this.db.get("previousValue") ?? null;
    },
    _setPreviousValue(value) {
      this.db.set("previousValue", value);
    },
  },
  async run() {
    const {
      fieldName, newValue,
    } = this;

    // Check if the field value has changed
    if (newValue !== this._getPreviousValue()) {
      // Emit the new event
      this.$emit(
        {
          fieldName,
          newValue,
          previousValue: this._getPreviousValue(),
        },
        {
          id: fieldName,
          summary: `Field ${fieldName} changed from ${this._getPreviousValue()} to ${newValue}`,
          ts: Date.now(),
        },
      );

      // Update the previous value in the db
      this._setPreviousValue(newValue);
    }
  },
};
