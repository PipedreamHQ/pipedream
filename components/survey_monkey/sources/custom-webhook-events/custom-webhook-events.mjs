import surveyMonkey from "../../survey_monkey.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Custom webhook events",
  version: "0.0.3",
  type: "source",
  key: "survey_monkey-custom-webhook-events",
  description: "Emit new custom webhook event",
  props: {
    ...common.props,
    objectType: {
      propDefinition: [
        surveyMonkey,
        "objectType",
      ],
      reloadProps: true,
    },
    eventType: {
      propDefinition: [
        surveyMonkey,
        "eventType",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.objectType === "collector") {
      return {
        eventType: {
          type: "string",
          label: "Event types",
          description: "Event type that the webhook listens to",
          options: this.surveyMonkey.getCollectorTypes(),
          reloadProps: true,
        },
        survey: {
          type: "string",
          label: "Survey",
          description: "Survey where the action will be performed.",
          options: async () => {
            const data = await this.surveyMonkey.getSurveys();

            return data.map((survey) => ({
              label: survey.title,
              value: survey.id,
            }));
          },
        },
        object_ids: {
          type: "string[]",
          label: "Collector",
          description: "Collector where the action will be performed.",
          options: async () => {
            const data = await this.surveyMonkey.getCollectors({
              surveyId: this.survey,
            });
            return data.map((collector) => ({
              label: collector.name,
              value: collector.id,
            }));
          },
        },
      };
    } else {
      if (this.eventType != "survey_created")
        return {
          object_ids: {
            type: "string[]",
            label: "Survey",
            description: "Survey where the action will be performed.",
            options: async () => {
              const data = await this.surveyMonkey.getSurveys();

              return data.map((survey) => ({
                label: survey.title,
                value: survey.id,
              }));
            },
          },
        };
    }
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.surveyMonkey.createCustomHook({
        endpoint: this.http.endpoint,
        objectType: this.objectType,
        eventType: this.eventType,
        objectIds: this.object_ids,
      });

      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New custom event - ${event.body.object_id}`;
    },
  },
};
