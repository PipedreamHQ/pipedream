import calendly_v2 from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-create-scheduling-link",
  name: "Create a Scheduling Link",
  description: "Creates a single-use scheduling link. [See the docs](https://calendly.stoplight.io/docs/api-docs/b3A6MzQyNTM0OQ-create-single-use-scheduling-link)",
  version: "0.0.1",
  type: "action",
  props: {
    calendly_v2,
    owner: {
      propDefinition: [
        calendly_v2,
        "eventType",
      ],
      label: "Owner",
    },
    maxEventCount: {
      propDefinition: [
        calendly_v2,
        "maxEventCount",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    params.max_event_count = this.maxEventCount;
    params.owner = this.owner;
    params.owner_type = "EventType";

    const response = await this.calendly_v2.createSchedulingLink(params, $);
    $.export("$summary", "Created a scheduling link successfully");
    return response;
  },
};
