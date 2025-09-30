import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-send-event",
  name: "Send Event",
  description: "Send an event to an email address. [See the Documentation](https://loops.so/docs/add-users/api-reference#send)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loops,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to send event to. If no contact with that email address exists, one will be added to your list.",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Name of the event to send",
    },
  },
  async run({ $ }) {
    const response = await this.loops.sendEvent({
      data: {
        email: this.email,
        eventName: this.eventName,
      },
      $,
    });

    $.export("$summary", `Successfully sent event "${this.eventName}" to  ${this.email}.`);

    return response[0];
  },
};
