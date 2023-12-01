import userflow from "../../userflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "userflow-new-flow-completed-instant",
  name: "New Flow Completed (Instant)",
  description: "Emits a new event when a flow is completed by a user by reaching a goal step. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    userflow,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    userId: {
      propDefinition: [
        userflow,
        "userId",
      ],
    },
    flowId: {
      propDefinition: [
        userflow,
        "flowId",
      ],
    },
    goalStep: {
      propDefinition: [
        userflow,
        "goalStep",
        (c) => ({
          flowId: c.flowId,
        }),
      ],
      optional: true,
    },
    surveyQuestions: {
      propDefinition: [
        userflow,
        "surveyQuestions",
        (c) => ({
          flowId: c.flowId,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Emit 50 most recent flow completion events for the configured user and flow
      // Since we don't have an endpoint to fetch historical flow completions, we'll skip this
    },
    async activate() {
      // Create a webhook subscription if necessary
      // Since we don't have a method to create a webhook in the provided app file, we'll skip this
    },
    async deactivate() {
      // Delete the webhook subscription if necessary
      // Since we don't have a method to delete a webhook in the provided app file, we'll skip this
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["Userflow-Signature"];

    // Validate webhook signature if necessary
    // Since we don't have a signature secret or method to validate, we'll skip this

    if (body.object === "event" && body.name === "flow_completed" && body.user_id === this.userId && body.group_id === this.flowId) {
      if (this.goalStep && body.attributes.goal_step !== this.goalStep) {
        // If a specific goal step is configured and the event's goal step doesn't match, ignore the event
        return;
      }

      if (this.surveyQuestions) {
        // If survey questions are configured, ensure they match the event's survey questions
        const eventSurveyQuestions = body.attributes.survey_questions || [];
        const configuredSurveyQuestions = this.surveyQuestions;
        if (!configuredSurveyQuestions.every((question) => eventSurveyQuestions.includes(question))) {
          // If there's a mismatch in survey questions, ignore the event
          return;
        }
      }

      // Emit the event as it matches all the criteria
      this.$emit(body, {
        id: body.id,
        summary: `Flow ${body.group_id} completed by user ${body.user_id}`,
        ts: Date.parse(body.created_at),
      });
    }
  },
};
