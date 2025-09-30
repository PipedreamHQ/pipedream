import constants from "../../common/constants.mjs";
import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-resolve-incident",
  name: "Resolve Incident",
  description: "Resolve an incident. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE0Mg-update-an-incident)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pagerduty,
    incidentId: {
      propDefinition: [
        pagerduty,
        "incidentId",
        () => ({
          statuses: [
            constants.INCIDENT_STATUS.TRIGGERED,
            constants.INCIDENT_STATUS.ACKNOWLEDGED,
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
          type: constants.REFERENCE.INCIDENT,
          status: constants.INCIDENT_STATUS.RESOLVED,
        },
      },
    });

    $.export("$summary", `Incident ${incident.summary} has been ${incident.status}`);

    return incident;
  },
};
