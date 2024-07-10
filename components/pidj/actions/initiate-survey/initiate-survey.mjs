import { ConfigurationError } from "@pipedream/platform";
import pidj from "../../pidj.app.mjs";

export default {
  key: "pidj-initiate-survey",
  name: "Initiate Survey",
  description: "Triggers a pre-configured text survey to a specific contact. Requires the contact's information and the survey ID. [See the documentation](https://pidj.co/wp-content/uploads/2023/06/Pidj-API-Technical-Document-v3-1.pdf).",
  version: "0.0.1",
  type: "action",
  props: {
    pidj,
    surveyId: {
      propDefinition: [
        pidj,
        "surveyId",
      ],
    },
    contactId: {
      propDefinition: [
        pidj,
        "contactId",
      ],
    },
    fromNumber: {
      propDefinition: [
        pidj,
        "fromNumber",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        pidj,
        "groupId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.fromNumber && !this.groupId) || (this.fromNumber && this.groupId)) {
      throw new ConfigurationError("You must provide either From Number or Group Id.");
    }

    const response = await this.pidj.triggerSurvey({
      $,
      data: {
        survey_id: this.surveyId,
        contact_id: this.contactId,
        from_number: this.fromNumber,
        group_id: this.groupId,
      },
    });

    $.export("$summary", `Successfully initiated survey for contact ${this.contactId}`);
    return response;
  },
};
