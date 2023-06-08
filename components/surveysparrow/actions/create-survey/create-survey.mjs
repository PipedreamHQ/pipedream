import surveySparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-create-survey",
  name: "Create Survey",
  description: "Creates a new survey. [See the documentation](https://developers.surveysparrow.com/rest-apis/survey#postV3Surveys)",
  version: "0.0.1",
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
    surveyFolder: {
      propDefinition: [
        surveySparrow,
        "surveyFolder",
      ],
    },
    visibility: {
      propDefinition: [
        surveySparrow,
        "visibility",
      ],
    },
    theme: {
      propDefinition: [
        surveySparrow,
        "theme",
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
    const response = await this.surveySparrow.createSurvey({
      data: {
        name: this.name,
        survey_type: this.surveyType,
        survey_folder_id: this.surveyFolder,
        visibility: this.visibility,
        theme_id: this.theme,
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
