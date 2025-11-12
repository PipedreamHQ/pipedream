import calendly from "../../calendly_v2.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "calendly_v2-create-scheduling-link",
  name: "Create a Scheduling Link",
  description: "Creates a single-use scheduling link. [See the documentation](https://calendly.stoplight.io/docs/api-docs/b3A6MzQyNTM0OQ-create-single-use-scheduling-link)",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    calendly,
    owner: {
      propDefinition: [
        calendly,
        "eventType",
      ],
      label: "Owner",
    },
    maxEventCount: {
      propDefinition: [
        calendly,
        "maxEventCount",
      ],
    },
  },
  async run({ $ }) {
    if (!this.owner) {
      throw new ConfigurationError("Owner prop is required. Please provide the unique identifier of an event type.");
    }

    const params = {};
    params.max_event_count = this.maxEventCount;
    params.owner = this.owner;
    params.owner_type = "EventType";

    const response = await this.calendly.createSchedulingLink(params, $);
    $.export("$summary", "Created a scheduling link successfully");
    return response;
  },
};
