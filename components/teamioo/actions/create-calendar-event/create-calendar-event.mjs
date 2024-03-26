import teamioo from "../../teamioo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teamioo-create-calendar-event",
  name: "Create Calendar Event",
  description: "Creates a new calendar event. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    teamioo,
    eventTitle: teamioo.propDefinitions.eventTitle,
    startTime: teamioo.propDefinitions.startTime,
    endTime: teamioo.propDefinitions.endTime,
    eventType: {
      ...teamioo.propDefinitions.eventType,
      options: [
        {
          label: "Personal",
          value: "personal",
        },
        {
          label: "Office",
          value: "office",
        },
        {
          label: "Group",
          value: "group",
        },
      ],
    },
    location: {
      ...teamioo.propDefinitions.location,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.teamioo.createEvent({
      eventTitle: this.eventTitle,
      startTime: this.startTime,
      endTime: this.endTime,
      eventType: this.eventType,
      location: this.location,
    });

    $.export("$summary", `Successfully created ${this.eventType} event titled "${this.eventTitle}"`);
    return response;
  },
};
