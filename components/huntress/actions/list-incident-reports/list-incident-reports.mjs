import app from "../../huntress.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "huntress-list-incident-reports",
  name: "List Incident Reports",
  description: "List incident reports associated with your Huntress account. [See the documentation](https://api.huntress.io/docs#tag/incident-reports/get/v1/incident_reports)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    indicatorType: {
      type: "string",
      label: "Indicator Type",
      description: "Filter by indicator type.",
      optional: true,
      options: constants.INDICATOR_TYPE_OPTIONS,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by status.",
      optional: true,
      options: constants.INCIDENT_STATUS_OPTIONS,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "Filter by severity.",
      optional: true,
      options: constants.SEVERITY_OPTIONS,
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Filter by platform.",
      optional: true,
      options: constants.INCIDENT_PLATFORM_OPTIONS,
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
      description: "Filter by organization ID within Huntress account.",
    },
    agentId: {
      propDefinition: [
        app,
        "agentId",
      ],
      optional: true,
      description: "Filter by agent ID within Huntress account.",
    },
  },
  async run({ $ }) {
    const incidentReports = await this.app.paginate({
      fn: this.app.listIncidentReports.bind(this.app),
      fnArgs: {
        $,
        params: {
          indicator_type: this.indicatorType,
          status: this.status,
          severity: this.severity,
          platform: this.platform,
          organization_id: this.organizationId,
          agent_id: this.agentId,
        },
      },
      keyField: "incident_reports",
    });

    $.export("$summary", `Successfully retrieved \`${incidentReports.length}\` incident report(s)`);

    return incidentReports;
  },
};
