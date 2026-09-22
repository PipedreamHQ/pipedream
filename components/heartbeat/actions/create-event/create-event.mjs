import { parseObject } from "../../common/utils.mjs";
import heartbeat from "../../heartbeat.app.mjs";

export default {
  key: "heartbeat-create-event",
  name: "Create Event",
  description: "Create a new Event in a Heartbeat community. [See the documentation](https://heartbeat.readme.io/reference/createevent)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    heartbeat,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Date & Time",
      description: "The start date & time of the event. Accepts datetimes in the following formats: `YYYY-MM-DD hh:mm:ss` e.g. 2023-11-28 10:00:00, `YYYY-MM-DD hh:mm` e.g. 2023-11-28 10:00, `YYYY-MM-DD` e.g. 2023-11-28",
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The duration of the event in minutes",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Where the event will be held. If the string 'HEARTBEAT' is provided, then the event will take place in a Heartbeat voice channel. If the string 'ZOOM' is provided, then the event will take place in a custom Zoom link (this option can only be chosen if a Zoom account has been integrated with Heartbeat). Otherwise, the provided string will be passed directly to the Custom location field",
      options: [
        "HEARTBEAT",
        "ZOOM",
      ],
    },
    invitedUsers: {
      propDefinition: [
        heartbeat,
        "emails",
      ],
      type: "string[]",
      label: "Invited Users",
      description: "A list of users that should be invited to the event. If the email matches an existing Heartbeat user, the Heartbeat user will be invited. Otherwise, an event invite will be sent directly to the provided email address. If both `Invited Users` & `Invited Groups` are empty, the event will be open to everyone in the community",
      optional: true,
    },
    invitedGroups: {
      propDefinition: [
        heartbeat,
        "groupID",
      ],
      type: "string[]",
      label: "Invited Groups",
      description: "A list of groups that should be invited to the event. If both `Invited Users` and `Invited Groups` are empty, the event will be open to everyone in the community",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.heartbeat.createEvent({
      $,
      data: {
        name: this.name,
        description: this.description,
        startTime: this.startTime,
        duration: this.duration,
        location: this.location,
        invitedUsers: parseObject(this.invitedUsers),
        invitedGroups: parseObject(this.invitedGroups),
      },
    });

    $.export("$summary", `Successfully created event with ID ${response.event.id}.`);
    return response;
  },
};

