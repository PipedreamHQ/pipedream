import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-create-event",
  name: "Create Event",
  description: "Generates a new event in Userlist",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    userlist,
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Describes the type of event",
    },
    eventInfo: {
      type: "object",
      label: "Event Info",
      description: "Additional event related data",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.userlist.generateNewEvent({
      eventType: this.eventType,
      eventInfo: this.eventInfo,
    });
    $.export("$summary", `Successfully created event: ${this.eventType}`);
    return response;
  },
};
