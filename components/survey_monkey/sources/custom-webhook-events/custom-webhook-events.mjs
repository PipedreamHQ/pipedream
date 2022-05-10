import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  name: "Custom webhook events",
  version: "0.0.1",
  type: "source",
  key: "survey_monkey-custom-webhook-events",
  description: "Triggers on new events",
  props: {
    surveyMonkey,
    http: "$.interface.http",
    db: "$.service.db",
    objectType: {
      propDefinition: [
        surveyMonkey,
        "objectType",
      ],
    },
    eventType: {
      propDefinition: [
        surveyMonkey,
        "eventType",
      ],
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
            const { data } = await this.surveyMonkey.getSurveys();

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
            const { data } = await this.surveyMonkey.getCollectors({
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
              const { data } = await this.surveyMonkey.getSurveys();

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
    async activate() {
      const hookId = await this.surveyMonkey.createCustomHook({
        endpoint: this.http.endpoint,
        objectType: this.objectType,
        eventType: this.eventType,
        objectIds: this.object_ids,
      });

      this.db.set("hookId", hookId);
    },
    async deactivate() {
      await this.surveyMonkey.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.$emit(event, {
      summary: `New response from survey - ${event.body.object_id}`,
      ts: Date.now(),
    });
  },
};
