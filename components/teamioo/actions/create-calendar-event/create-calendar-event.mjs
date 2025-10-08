import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-create-calendar-event",
  name: "Create Calendar Event",
  description: "Creates a new calendar event. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamioo,
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of the event, either 'personal', 'group' or 'office'",
      options: [
        "personal",
        "group",
        "office",
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Event title.",
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start DATE of the event. Time fragment of this datetime is ignored.",
    },
    end: {
      type: "string",
      label: "End",
      description: "End DATE of the event. Time fragment of this datetime is ignored.",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "If present, time part of datetime indicates start time of the event. If omitted, the event is considered to be an \"all day\" event.",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "If present, time part of datetime indicates end time of the event. StartTime parameter must be present as well.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "The event note (markdown supported).",
      optional: true,
    },
    privacyLevel: {
      type: "string",
      label: "Privacy Level",
      description: "Visibility of the event. This does not apply to \"group\" calendar events.",
      options: [
        "public",
        "private",
        "secret",
      ],
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Where the event takes place.",
      optional: true,
    },
    invitedUsers: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      type: "string[]",
      label: "Invited Users",
      description: "Users invited to participate in the event. Each invited user receives an notification which he/she has to accept or reject.",
      optional: true,
    },
    connectedUsers: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      type: "string[]",
      label: "Connected Users",
      description: "Users connected to this event. Combines well with calEventType. Only for \"office\" events.",
      optional: true,
    },
    taggedUsers: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      type: "string[]",
      label: "Tagged Users",
      description: "Tagged users - ignored in private tasks.",
      optional: true,
    },
    tags: {
      propDefinition: [
        teamioo,
        "tags",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.eventType === "group") {
      props.groupId = {
        type: "string",
        label: "Group ID",
        description: "The ID of the group.",
        options: async () => {
          const groups = await this.teamioo.listGroups();

          return groups.map(({
            displayName: label, _id: value,
          }) => ({
            label,
            value,
          }));
        },
      };
    }
    if (this.eventType === "office") {
      props.calEventType = {
        type: "string[]",
        label: "Cal Event Type",
        description: "Type of the event from custom defined calendar event types. Only for \"office\" events.",
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      teamioo,
      eventType,
      groupId,
      ...data
    } = this;

    const response = await teamioo.createEvent({
      $,
      data: {
        groupId: (eventType === "personal")
          ? "personal"
          : groupId,
        ...data,
      },
    });

    $.export("$summary", `Successfully created event with Id: ${response.newDocId}`);
    return response;
  },
};
