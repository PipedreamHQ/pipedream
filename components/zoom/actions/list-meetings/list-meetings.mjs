import zoom from "../../zoom.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "List Meetings",
  description: "List meetings for a user. [See the documentation](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetings)",
  key: "zoom-list-meetings",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoom,
    userId: {
      propDefinition: [
        zoom,
        "meetingUserId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of meetings to list. Defaults to `scheduled`",
      optional: true,
      options: constants.MEETING_TYPES,
    },
    from: {
      type: "string",
      label: "From",
      description: "The start date and time of the meetings to list. Example: `2023-01-01`",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "The end date and time of the meetings to list. Example: `2023-01-01`",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone to use for the `from` and `to` dates. Example: `America/New_York`",
      optional: true,
    },
    titleSearch: {
      type: "string",
      label: "Title Search",
      description: "The title of the meetings to search for",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "The date and time to filter meetings created after. Example: `2023-01-01`",
      optional: true,
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "The date and time to filter meetings created before. Example: `2023-01-01`",
      optional: true,
    },
    max: {
      propDefinition: [
        zoom,
        "max",
      ],
    },
  },
  methods: {
    isRelevant(meeting) {
      if (this.titleSearch) {
        if (!meeting.topic.toLowerCase().includes(this.titleSearch.toLowerCase())) {
          return false;
        }
      }
      if (this.createdAfter && Date.parse(meeting.created_at) < Date.parse(this.createdAfter)) {
        return false;
      }
      if (this.createdBefore && Date.parse(meeting.created_at) > Date.parse(this.createdBefore)) {
        return false;
      }
      return true;
    },
  },
  async run({ $ }) {
    const meetings = [];
    let count = 0;

    const results = this.zoom.getResourcesStream({
      resourceFn: this.zoom.listMeetings,
      resourceFnArgs: {
        $,
        userId: this.userId,
        params: {
          type: this.type,
          from: this.from,
          to: this.to,
          timezone: this.timezone,
        },
      },
      resourceName: "meetings",
    });

    for await (const meeting of results) {
      if (!this.isRelevant(meeting)) {
        continue;
      }
      meetings.push(meeting);
      count++;
      if (count >= this.max) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${count} meeting${count === 1
      ? ""
      : "s"}`);

    return meetings;
  },
};
