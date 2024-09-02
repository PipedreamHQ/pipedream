import securityReporter from "../../security_reporter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "security_reporter-create-finding",
  name: "Create Security Finding",
  description: "Creates a new security finding. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    securityReporter,
    assessmentId: {
      propDefinition: [
        securityReporter,
        "assessmentId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the finding",
    },
    targets: {
      type: "string[]",
      label: "Targets",
      description: "The targets of the finding",
    },
    assessmentSectionId: {
      type: "string",
      label: "Assessment Section ID",
      description: "The ID of the assessment section",
    },
    isVulnerability: {
      type: "boolean",
      label: "Is Vulnerability",
      description: "Whether the finding is a vulnerability",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the finding",
    },
    severityMetrics: {
      type: "string",
      label: "Severity Metrics",
      description: "The severity metrics of the finding",
      optional: true,
    },
    severity: {
      type: "string",
      label: "Severity",
      description: "The severity of the finding",
      optional: true,
    },
    foundAt: {
      type: "string",
      label: "Found At",
      description: "The date when the finding was found",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the finding",
      optional: true,
    },
    complexity: {
      type: "string",
      label: "Complexity",
      description: "The complexity of the finding",
      optional: true,
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action taken for the finding",
      optional: true,
    },
    risk: {
      type: "string",
      label: "Risk",
      description: "The risk associated with the finding",
      optional: true,
    },
    recommendation: {
      type: "string",
      label: "Recommendation",
      description: "The recommendation for the finding",
      optional: true,
    },
    proof: {
      type: "string",
      label: "Proof",
      description: "The proof for the finding",
      optional: true,
    },
    references: {
      type: "string",
      label: "References",
      description: "The references for the finding",
      optional: true,
    },
    draftDocuments: {
      type: "string[]",
      label: "Draft Documents",
      description: "The draft documents for the finding",
      optional: true,
    },
    resolvers: {
      type: "string[]",
      label: "Resolvers",
      description: "The resolvers for the finding",
      optional: true,
    },
    userGroups: {
      type: "string[]",
      label: "User Groups",
      description: "The user groups for the finding",
      optional: true,
    },
    classifications: {
      type: "string[]",
      label: "Classifications",
      description: "The classifications for the finding",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.securityReporter.createSecurityFinding({
      assessmentId: this.assessmentId,
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

    $.export("$summary", `Successfully created security finding with title: ${this.title}`);
    return response;
  },
};
