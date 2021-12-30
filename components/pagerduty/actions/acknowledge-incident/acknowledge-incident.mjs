import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-acknowledge-incident",
  name: "Acknowledge Incident",
  description: "Acknowledge an incident. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE0Mg-update-an-incident)",
  type: "action",
  version: "0.0.1",
  props: {
    pagerduty,
    incidentId: {
      propDefinition: [
        pagerduty,
        "incidentId",
        () => ({
          statuses: [
            "triggered",
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const { incidentId } = this;

    const { incident } = await this.pagerduty.updateIncident({
      $,
      incidentId,
      data: {
        incident: {
          type: "incident_reference",
          status: "acknowledged",
        },
      },
    });

    $.export("$summary", `Incident ${incident.summary} has been acknowledged`);

    return incident;
  },
};
