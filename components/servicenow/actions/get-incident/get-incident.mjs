import servicenow from "../../servicenow.app.mjs";
import { assertSafeQueryValue } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-incident",
  name: "Get Incident",
  description: "Retrieve a ServiceNow incident from the `incident` table by number. Use this after **Submit Record Producer** or **Create Table Record** when you need the incident state, priority, and assignment for a follow-up link. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    incidentNumber: {
      propDefinition: [
        servicenow,
        "incidentNumber",
      ],
    },
    callerId: {
      type: "string",
      label: "Caller",
      description: "Optional `sys_id` of the caller to additionally filter by (matched against `caller_id`). Run **Find Users** to find it.",
      optional: true,
    },
  },
  async run({ $ }) {
    assertSafeQueryValue(this.incidentNumber, "Incident Number");
    assertSafeQueryValue(this.callerId, "Caller");

    const queryParts = [
      `number=${this.incidentNumber}`,
    ];
    if (this.callerId) {
      queryParts.push(`caller_id=${this.callerId}`);
    }
    const response = await this.servicenow.getIncidents({
      $,
      params: {
        sysparm_query: queryParts.join("^"),
        sysparm_limit: 1,
      },
    });

    const incident = response?.[0];
    let summary;
    if (!incident) {
      summary = `No incident found with number ${this.incidentNumber}`;
    } else {
      const state = incident.state ?? incident.incident_state;
      summary = state
        ? `Retrieved incident ${this.incidentNumber}: ${state}`
        : `Retrieved incident ${this.incidentNumber}`;
    }
    $.export("$summary", summary);

    return response;
  },
};
