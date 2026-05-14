import hubspot from "../../hubspot.app.mjs";

const MEETING_LINK_TYPES = [
  {
    label: "Personal Link",
    value: "PERSONAL_LINK",
  },
  {
    label: "Group Calendar",
    value: "GROUP_CALENDAR",
  },
  {
    label: "Round Robin Calendar",
    value: "ROUND_ROBIN_CALENDAR",
  },
];

export default {
  key: "hubspot-list-meeting-links",
  name: "List Meeting Links",
  description: "List meeting scheduling pages for a HubSpot organizer. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/scheduler/guide#list-meeting-scheduling-pages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    organizerUserId: {
      propDefinition: [
        hubspot,
        "organizerUserId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter results by meeting link name (substring match).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter results by meeting link type. Example: `PERSONAL_LINK`, `GROUP_CALENDAR`, or `ROUND_ROBIN_CALENDAR`.",
      optional: true,
      options: MEETING_LINK_TYPES,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of meeting links to return.",
      optional: true,
      min: 1,
    },
  },
  async run({ $ }) {
    const {
      results = [], total = 0,
    } = await this.hubspot.listMeetingLinks({
      $,
      params: {
        organizerUserId: this.organizerUserId,
        name: this.name,
        type: this.type,
        limit: this.limit,
      },
    });

    $.export(
      "$summary",
      `Found ${results.length} meeting link${results.length === 1
        ? ""
        : "s"}${total && total !== results.length
        ? ` (of ${total} total)`
        : ""}`,
    );

    return results;
  },
};
