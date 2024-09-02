import { axios } from "@pipedream/platform";
import securityReporter from "../../security_reporter.app.mjs";

export default {
  key: "security_reporter-new-assessment-instant",
  name: "New Assessment Created",
  description: "Emit new event when an assessment is created. [See the documentation](https://trial3.securityreporter.app/api-documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    securityReporter,
    db: "$.service.db",
    name: {
      propDefinition: [
        securityReporter,
        "name",
      ],
    },
    mode: {
      propDefinition: [
        securityReporter,
        "mode",
      ],
    },
    includes: {
      propDefinition: [
        securityReporter,
        "includes",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events when the source is deployed
      const assessments = await this.securityReporter.listAssessments();
      assessments.slice(0, 50).forEach((assessment) => {
        this.emitAssessmentCreatedEvent(assessment);
      });
    },
    async activate() {
      // Activation logic if needed
    },
    async deactivate() {
      // Deactivation logic if needed
    },
  },
  methods: {
    emitAssessmentCreatedEvent(assessment) {
      const {
        id, title, created_at: createdAt,
      } = assessment;
      this.$emit(
        {
          id,
          title,
          createdAt,
        },
        {
          summary: `New assessment created: ${title}`,
          id,
          ts: new Date(createdAt).getTime(),
        },
      );
    },
  },
  async run() {
    // Emit events for new assessments
    const assessments = await this.securityReporter.listAssessments();
    assessments.forEach((assessment) => {
      this.emitAssessmentCreatedEvent(assessment);
    });
  },
};
