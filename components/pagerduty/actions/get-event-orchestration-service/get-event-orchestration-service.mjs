import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-get-event-orchestration-service",
  name: "Get Event Orchestration for Service",
  description:
    "Get the active event orchestration routing rules configured for a service."
    + " Event orchestration routes incoming events to the right responders based on conditions."
    + " Use **List Services** to discover service IDs."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/179537b835e2d-get-the-service-orchestration-for-a-service)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service to retrieve orchestration rules for. Use **List Services** to discover IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getEventOrchestrationService({
      $,
      serviceId: this.serviceId,
    });

    $.export("$summary", `Retrieved event orchestration for service ${this.serviceId}`);
    return response;
  },
};
