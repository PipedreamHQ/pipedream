import {
  PARTICIPANT_GENDER_OPTIONS,
  PARTICIPANT_STATUS_OPTIONS,
} from "../../common/constants.mjs";
import app from "../../evenium.app.mjs";

export default {
  type: "action",
  key: "evenium-add-participants",
  version: "0.0.1",
  name: "Add Participants",
  description: "Adds participants (guests) to an event. [See the documentation](https://static.evenium.com/api-docs/organizer/index-json.html#5.3)",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the participant",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the participant",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the participant",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name of the participant",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the participant",
      optional: true,
      options: PARTICIPANT_GENDER_OPTIONS,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The registration status of the participant",
      optional: true,
      options: PARTICIPANT_STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const guestData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };

    if (this.company) {
      guestData.company = this.company;
    }

    if (this.gender) {
      guestData.gender = this.gender;
    }

    if (this.status) {
      guestData.status = this.status;
    }

    const response = await this.app.createGuest({
      $,
      eventId: this.eventId,
      data: guestData,
    });

    $.export("$summary", `Successfully added participant "**${this.firstName} ${this.lastName}**" with \`guestId\`: ${response.guestId}`);

    return response;
  },
};

