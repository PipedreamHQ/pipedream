import { SCORING_SYSTEM_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import securityReporter from "../../security_reporter.app.mjs";

export default {
  key: "security_reporter-create-assessment",
  name: "Create Security Assessment",
  description: "Creates a new security assessment. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.1",
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
    languageId: {
      propDefinition: [
        securityReporter,
        "languageId",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the assessment. Must not be greater than 191 characters.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to organize assessments. Tags are not case sensitive. Must not be greater than 191 characters.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short description. Must not be greater than 191 characters.",
      optional: true,
    },
    scoringSystem: {
      type: "string",
      label: "Scoring System",
      description: "The scoring system for the assessment. If not set, the default scoring system will be used. The default scoring system can be changed in the settings. Must be a valid scoring system.",
      options: SCORING_SYSTEM_OPTIONS,
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
    const response = await this.securityReporter.createAssessment({
      $,
      clientId: this.clientId,
      data: {
        assessment_template_id: this.assessmentTemplateId,
        language_id: this.languageId,
        title: this.title,
        tags: parseObject(this.tags),
        description: this.description,
        scoring_system: this.scoringSystem,
        theme_id: this.themeId,
      },
    });

    $.export("$summary", `Successfully created assessment with Id: ${response.id}`);
    return response;
  },
};
