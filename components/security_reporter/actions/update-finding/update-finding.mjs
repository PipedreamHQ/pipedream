import securityReporter from "../../security_reporter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "security_reporter-update-finding",
  name: "Update Security Finding",
  description: "Updates an existing security finding. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    securityReporter,
    findingId: {
      propDefinition: [
        securityReporter,
        "findingId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Optional title for the finding",
      optional: true,
    },
    targets: {
      type: "string",
      label: "Targets",
      description: "Optional targets for the finding",
      optional: true,
    },
    assessmentSectionId: {
      type: "string",
      label: "Assessment Section ID",
      description: "Optional assessment section ID for the finding",
      optional: true,
    },
    isVulnerability: {
      type: "boolean",
      label: "Is Vulnerability",
      description: "Optional flag to indicate if it's a vulnerability",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the finding",
      optional: true,
    },
    severityMetrics: {
      type: "string",
      label: "Severity Metrics",
      description: "Optional severity metrics for the finding",
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "Optional severity level of the finding",
      optional: true,
    },
    foundAt: {
      type: "string",
      label: "Found At",
      description: "Optional date when the finding was found",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Optional priority level of the finding",
      optional: true,
    },
    complexity: {
      type: "string",
      label: "Complexity",
      description: "Optional complexity level of the finding",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "Optional action to be taken for the finding",
      optional: true,
    },
    risk: {
      type: "string",
      label: "Risk",
      description: "Optional risk level of the finding",
      optional: true,
    },
    recommendation: {
      type: "string",
      label: "Recommendation",
      description: "Optional recommendation for the finding",
      optional: true,
    },
    proof: {
      type: "string",
      label: "Proof",
      description: "Optional proof for the finding",
      optional: true,
    },
    references: {
      type: "string",
      label: "References",
      description: "Optional references for the finding",
      optional: true,
    },
    draftDocuments: {
      type: "string",
      label: "Draft Documents",
      description: "Optional draft documents for the finding",
      optional: true,
    },
    resolvers: {
      type: "string",
      label: "Resolvers",
      description: "Optional resolvers for the finding",
      optional: true,
    },
    userGroups: {
      type: "string",
      label: "User Groups",
      description: "Optional user groups for the finding",
      optional: true,
    },
    classifications: {
      type: "string",
      label: "Classifications",
      description: "Optional classifications for the finding",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.securityReporter.updateSecurityFinding({
      findingId: this.findingId,
      title: this.title,
      targets: this.targets,
      assessmentSectionId: this.assessmentSectionId,
      isVulnerability: this.isVulnerability,
      description: this.description,
      severityMetrics: this.severityMetrics,
      severity: this.severity,
      foundAt: this.foundAt,
      priority: this.priority,
      complexity: this.complexity,
      action: this.action,
      risk: this.risk,
      recommendation: this.recommendation,
      proof: this.proof,
      references: this.references,
      draftDocuments: this.draftDocuments,
      resolvers: this.resolvers,
      userGroups: this.userGroups,
      classifications: this.classifications,
    });

    $.export("$summary", `Successfully updated finding with ID ${this.findingId}`);
    return response;
  },
};
