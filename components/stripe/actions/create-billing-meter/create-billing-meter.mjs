import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-billing-meter",
  name: "Create Billing Meter",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a billing meter. [See the documentation](https://docs.stripe.com/api/billing/meter/create).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Meters specify how to aggregate meter events over a billing period. Meter events represent all actions that customers take in your system (for example, API requests). Meters attach to prices and form the basis of what's billed. [See the documentation](https://docs.stripe.com/api/billing/meter/create).",
    },
    defaultAggregationFormula: {
      type: "string",
      label: "Default Aggregation Formula",
      description: "Specifies how events are aggregated",
      options: [
        {
          label: "Count the number of events",
          value: "count",
        },
        {
          label: "Take the last event's value in the window",
          value: "last",
        },
        {
          label: "Sum each event's value",
          value: "sum",
        },
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The meter's name. Not visible to the customer.",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the meter event to record usage for. Corresponds with the `event_name` field on meter events.",
    },
    customerMappingEventPayloadKey: {
      type: "string",
      label: "Customer Mapping Event Payload Key",
      description: "The key in the meter event payload to use for mapping the event to a customer.",
      optional: true,
    },
    eventTimeWindow: {
      type: "string",
      label: "Event Time Window",
      description: "The time window to pre-aggregate meter events for, if any.",
      optional: true,
      options: [
        {
          label: "Events are pre-aggregated in daily buckets",
          value: "day",
        },
        {
          label: "Events are pre-aggregated in hourly buckets",
          value: "hour",
        },
      ],
    },
    valueSettingsEventPayloadKey: {
      type: "string",
      label: "Value Settings Event Payload Key",
      description: "The key in the usage event payload to use as the value for this meter. For example, if the event payload contains usage on a `bytes_used` field, then set it to `bytes_used`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      defaultAggregationFormula,
      displayName,
      eventName,
      customerMappingEventPayloadKey,
      eventTimeWindow,
      valueSettingsEventPayloadKey,
    } = this;

    const response = await this.app.sdk().billing.meters.create({
      default_aggregation: {
        formula: defaultAggregationFormula,
      },
      display_name: displayName,
      event_name: eventName,
      ...(customerMappingEventPayloadKey && {
        customer_mapping: {
          event_payload_key: customerMappingEventPayloadKey,
          type: "by_id",
        },
      }),
      event_time_window: eventTimeWindow,
      ...(valueSettingsEventPayloadKey && {
        value_settings: {
          event_payload_key: valueSettingsEventPayloadKey,
        },
      }),
    });

    $.export("$summary", `Successfully created a new billing meter with ID \`${response.id}\``);
    return response;
  },
};
