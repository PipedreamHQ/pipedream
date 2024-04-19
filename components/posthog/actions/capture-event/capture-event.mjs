import posthog from "../../posthog.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "posthog-capture-event",
  name: "Capture Event",
  description: "Captures a given event within the posthog system",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    posthog,
    event: {
      propDefinition: [
        posthog,
        "event",
      ],
    },
    properties: {
      propDefinition: [
        posthog,
        "properties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.posthog.emitEvent({
      event: this.event,
      properties: this.properties,
    });
    $.export("$summary", `Successfully captured event ${this.event}`);
    return response;
  },
};
