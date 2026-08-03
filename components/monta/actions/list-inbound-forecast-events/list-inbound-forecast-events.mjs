// x-pd-ai: optimized
import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-inbound-forecast-events",
  name: "List Inbound Forecast Events",
  description: "List inbound forecast change events created after the provided cursor ID. Use this for reliable incremental syncing of inbound forecast changes by repeatedly polling with the last event ID. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1events~1since_id~1%7Bid%7D/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    sinceId: {
      type: "integer",
      label: "Since ID",
      description: "Return events created after this event ID. Use `0` to start from the beginning.",
    },
  },
  async run({ $ }) {
    const events = await this.monta.listInboundForecastEvents({
      $,
      id: this.sinceId,
    });

    $.export("$summary", `Successfully retrieved ${events.length} inbound forecast event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
