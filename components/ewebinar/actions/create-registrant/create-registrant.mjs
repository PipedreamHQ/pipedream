import ewebinar from "../../ewebinar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ewebinar-create-registrant",
  name: "Create Registrant",
  description: "Registers a new attendee for a specific eWebinar event. [See the documentation](https://ewebinar.stoplight.io/docs/ewebinar-developer-rest-api-documentation/207a6e0b9b1d1-register-for-session)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ewebinar,
    webinarId: {
      type: "string",
      label: "Webinar ID",
      description: "ID of the webinar to register for",
    },
    sessionTime: {
      type: "string",
      label: "Session Time",
      description: "Must be the value field from a Session object (replay, ondemand, or ISO Formatted Time)",
    },
    sessionType: {
      type: "string",
      label: "Session Type",
      description: "Must be the type field from the Session object",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of registrant",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of registrant",
    },
    // Include any other required props here
    // Optional props should be marked with `optional: true`
  },
  async run({ $ }) {
    const data = {
      sessionTime: this.sessionTime,
      sessionType: this.sessionType,
      email: this.email,
      firstName: this.firstName,
      // Include any other required data fields here
      // Optional data fields should be included conditionally
    };

    const response = await this.ewebinar._makeRequest({
      method: "POST",
      path: `/webinars/${this.webinarId}/registrants`,
      data,
    });

    $.export("$summary", `Successfully registered ${this.email} for webinar ID ${this.webinarId}`);
    return response;
  },
};
