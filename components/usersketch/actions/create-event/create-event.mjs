import app from "../../usersketch.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Event",
  version: "0.0.1",
  key: "usersketch-create-event",
  description: "Create an event. [See the documentation](https://usersketch.readme.io/reference/post_api-customer-event-create)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user",
    },
    eventType: {
      type: "string",
      label: "Event type",
      description: "Type of the event",
      options: constants.EVENT_TYPES,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Unix timestamp in seconds representing when the event occurred",
    },
    link: {
      type: "string",
      label: "Link",
      description: "The link to the event",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The note or email's HTML or text body",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
  },
  async run({ $ }) {
    const response = await this.app.createEvent({
      $,
      data: {
        customerData: {
          email: this.email,
        },
        eventData: {
          eventType: this.eventType,
          date: this.date,
          link: this.link,
          message: this.message,
          subject: this.subject,
        },
      },
    });

    if (response.success) {
      $.export("$summary", "Successfully created event");
    }

    return response;
  },
};
