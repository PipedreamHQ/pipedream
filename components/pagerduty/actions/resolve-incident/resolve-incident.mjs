import constants from "../../common/constants.mjs";
import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-resolve-incident",
  name: "Resolve Incident",
  description: "**Deprecated** — use **Update Incident** instead. Resolve an incident. [See the documentation](https://developer.pagerduty.com/api-reference/8a0e1aa2ec666-update-an-incident)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
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
