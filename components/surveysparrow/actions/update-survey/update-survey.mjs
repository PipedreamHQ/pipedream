import { ConfigurationError } from "@pipedream/platform";
import pickBy from "lodash.pickby";
import surveySparrow from "../../surveysparrow.app.mjs";

export default {
  key: "surveysparrow-update-survey",
  name: "Update Survey",
  description: "Updates an existing survey. [See the documentation](https://developers.surveysparrow.com/rest-apis/survey#patchV3SurveysId)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    welcomeText: {
      propDefinition: [
        surveySparrow,
        "welcomeText",
      ],
    },
  },
  async run({ $ }) {
    if (!this.name && !this.welcomeText) {
      throw new ConfigurationError("At least one of `name` or `welcomeText` must be provided.");
    }

    const { data: response } = await this.surveySparrow.updateSurvey({
      surveyId: this.survey,
      data: pickBy({
        name: this.name,
        welcome_text: this.welcomeText,
      }),
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated survey with ID ${response[0].id}`);
    }

    return response;
  },
};
