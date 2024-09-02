import securityReporter from "../../security_reporter.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "security_reporter-create-assessment",
  name: "Create Security Assessment",
  description: "Creates a new security assessment. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    securityReporter,
    clientId: {
      propDefinition: [
        securityReporter,
        "clientId",
      ],
    },
    assessmentTemplateId: {
      propDefinition: [
        securityReporter,
        "assessmentTemplateId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the security assessment",
    },
    languageId: {
      propDefinition: [
        securityReporter,
        "languageId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the assessment",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the assessment",
      optional: true,
    },
    scoringSystem: {
      type: "string",
      label: "Scoring System",
      description: "The scoring system for the assessment",
      optional: true,
    },
    themeId: {
      propDefinition: [
        securityReporter,
        "themeId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.securityReporter.createSecurityAssessment({
      clientId: this.clientId,
      assessmentTemplateId: this.assessmentTemplateId,
      title: this.title,
      languageId: this.languageId,
      tags: this.tags,
      description: this.description,
      scoringSystem: this.scoringSystem,
      themeId: this.themeId,
    });

    $.export("$summary", `Successfully created assessment with title: ${this.title}`);
    return response;
  },
};
