import app from "../../better_stack.app.mjs";

export default {
  key: "better_stack-acknowledge-incident",
  name: "Acknowledge Incident",
  description: "Acknowledges an incident, marking it as acknowledged in Better Stack. [See the documentation](https://betterstack.com/docs/uptime/api/acknowledge-an-ongoing-incident/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    incidentId: {
      propDefinition: [
        app,
        "incidentId",
      ],
    },
    acknowledgedBy: {
      type: "string",
      label: "Acknowledged By",
      description: "User e-mail or a custom identifier of the entity that acknowledged the incident",
      optional: true,
    },
  },
  methods: {
    acknowledgeIncident({
      incidentId, ...args
    } = {}) {
      return this.app.post({
        path: `/incidents/${incidentId}/acknowledge`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      acknowledgeIncident,
      incidentId,
      acknowledgedBy,
    } = this;

    const response = await acknowledgeIncident({
      $,
      incidentId,
      data: {
        acknowledged_by: acknowledgedBy,
      },
    });

    $.export("$summary", `Successfully acknowledged incident with ID \`${response.data.id}\``);
    return response;
  },
};
