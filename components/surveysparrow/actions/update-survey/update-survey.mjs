import surveySparrow from "../../surveysparrow.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "surveysparrow-update-survey",
  name: "Update Survey",
  description: "Updates an existing survey. [See the documentation](https://developers.surveysparrow.com/rest-apis/survey#patchV3SurveysId)",
  version: "0.0.1",
  type: "action",
  props: {
    surveySparrow,
    survey: {
      propDefinition: [
        surveySparrow,
        "survey",
      ],
    },
    name: {
      propDefinition: [
        surveySparrow,
        "name",
      ],
      optional: true,
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
    const response = await this.surveySparrow.updateSurvey({
      surveyId: this.survey,
      data: pickBy({
        name: this.name,
        survey_type: this.surveyType,
        survey_folder_id: this.surveyFolder,
        visibility: this.visibility,
        theme_id: this.theme,
        welcome_text: this.welcomeText,
      }),
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created survey with ID ${response.id}`);
    }

    return response;
  },
};
