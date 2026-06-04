import app from "../../deel.app.mjs";

export default {
  key: "deel-create-shift-rate",
  name: "Create Shift Rate",
  description:
    "Create a named shift rate for GP (Global Payroll) time tracking in Deel."
    + " Shift rates define how time-tracked work is compensated."
    + " `external_id` is a unique identifier you assign (e.g., `rate-overtime-001`); use this ID when"
    + " creating shifts via **Create Shifts**."
    + " `type` must be one of: `MULTIPLIER_PERCENTAGE` (e.g., 150 = 1.5x pay),"
    + " `PER_HOUR_FLAT_RATE` (fixed hourly amount), `PER_UNIT_FLAT_RATE` (fixed per-unit amount)."
    + " [See the documentation](https://developer.deel.com/docs/create-a-shift-rate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "A human-readable name for this shift rate (e.g., `Overtime Rate`, `Holiday Rate`).",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your unique identifier for this shift rate (e.g., `rate-overtime-001`). Used when referencing this rate in shifts.",
    },
    type: {
      type: "string",
      label: "Rate Type",
      description: "The type of rate calculation. One of: `MULTIPLIER_PERCENTAGE`, `PER_HOUR_FLAT_RATE`, `PER_UNIT_FLAT_RATE`.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The rate value. For `MULTIPLIER_PERCENTAGE`, use a percentage (e.g., `150` for 1.5x). For flat rates, use the amount.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      name: this.name,
      external_id: this.externalId,
    };
    if (this.type) payload.type = this.type;
    if (this.value) payload.value = parseFloat(this.value);

    try {
      const response = await this.app._makeRequest({
        $,
        path: "/time_tracking/shift_rates",
        method: "POST",
        data: {
          data: payload,
        },
      });

      $.export("$summary", `Created shift rate: ${this.name} (external_id: ${this.externalId})`);
      return response;
    } catch (err) {
      // 422 means a shift rate with this external_id already exists — treat as idempotent success
      if (err?.response?.status === 422 || err?.status === 422) {
        const existing = {
          data: {
            external_id: this.externalId,
            name: this.name,
            type: this.type,
            value: this.value
              ? parseFloat(this.value)
              : undefined,
          },
          note: "Shift rate with this external_id already exists.",
        };
        $.export("$summary", `Shift rate already exists: ${this.name} (external_id: ${this.externalId})`);
        return existing;
      }
      throw err;
    }
  },
};
