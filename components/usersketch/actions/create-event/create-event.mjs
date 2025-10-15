import app from "../../usersketch.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Event",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The time when the event occurred. Can be in Unix timestamp or ISO8601 format, for example, `2023-12-08T10:00:00+07:00`",
      optional: true,
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
    const date = !this.date
      ? Math.floor(Date.now() / 1000)
      : Math.floor((new Date(this.date.length === 10
        ? +this.date * 1000
        : this.date)).getTime() / 1000);

    const response = await this.app.createEvent({
      $,
      data: {
        customerData: {
          email: this.email,
        },
        eventData: {
          eventType: this.eventType,
          date,
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
