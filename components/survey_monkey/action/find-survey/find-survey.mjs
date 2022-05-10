import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-find-survey",
  name: "Find survey",
  version: "0.0.1",
  type: "action",
  props: {
    surveyMonkey,
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurvey({
      $,
      surveyId: this.survey,
    });
    $.export(
      "$summary",
      `Successfully fetched ${response.title} survey details`,
    );
    return response;
  },
};
