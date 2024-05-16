import pidj from "../../pidj.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pidj-initiate-survey",
  name: "Initiate Survey",
  description: "Triggers a pre-configured text survey to a specific contact. Requires the contact's information and the survey ID.",
  version: "0.0.1",
  type: "action",
  props: {
    pidj,
    contactInformation: {
      propDefinition: [
        pidj,
        "contactInformation",
      ],
    },
    surveyId: {
      propDefinition: [
        pidj,
        "surveyId",
      ],
    },
    scheduleTimeForSurvey: {
      propDefinition: [
        pidj,
        "scheduleTimeForSurvey",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pidj.triggerSurvey({
      contactInformation: this.contactInformation,
      surveyId: this.surveyId,
      scheduleTimeForSurvey: this.scheduleTimeForSurvey,
    });

    $.export("$summary", `Successfully initiated survey with ID ${this.surveyId} for contact ${this.contactInformation.email || this.contactInformation.phone}`);
    return response;
  },
};
