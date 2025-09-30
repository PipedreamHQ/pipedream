import surveySparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-create-survey",
  name: "Create Survey",
  description: "Creates a new survey. [See the documentation](https://developers.surveysparrow.com/rest-apis/survey#postV3Surveys)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    surveySparrow,
    name: {
      propDefinition: [
        surveySparrow,
        "name",
      ],
    },
    surveyType: {
      propDefinition: [
        surveySparrow,
        "surveyType",
      ],
    },
    visibility: {
      propDefinition: [
        surveySparrow,
        "visibility",
      ],
    },
    welcomeText: {
      propDefinition: [
        surveySparrow,
        "welcomeText",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.surveySparrow.createSurvey({
      data: {
        name: this.name,
        survey_type: this.surveyType,
        visibility: this.visibility,
        welcome_text: this.welcomeText,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created survey with ID ${response.id}`);
    }

    return response;
  },
};
