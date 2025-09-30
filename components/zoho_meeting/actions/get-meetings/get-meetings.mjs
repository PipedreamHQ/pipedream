import app from "../../zoho_meeting.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Get Meetings",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "zoho_meeting-get-meetings",
  description: "Get a list of meetings. [See the documentation](https://www.zoho.com/meeting/api-integration/meeting-api/list-of-meeting-api.html)",
  type: "action",
  props: {
    app,
    count: {
      label: "Count",
      description: "Quantity of meetings to list",
      type: "integer",
      optional: true,
      default: 100,
    },
    listType: {
      label: "List Type",
      description: "List type of the meeting. Default `all`",
      type: "string",
      optional: true,
      default: constants.LIST_TYPES[0].value,
      options: constants.LIST_TYPES,
    },
  },
  async run({ $ }) {
    let meetings = [];
    const params = {
      listtype: this.listType,
      count: 100,
      index: 1,
    };

    while (meetings.length < this.count) {
      const {
        count, session: sessions,
      } = await this.app.getMeetings({
        $,
        params,
      });

      meetings = meetings.concat(sessions);

      if (count < 100) break;
      params.index += params.count;
    }

    if (meetings?.length > this.count) {
      meetings.length = this.count;
    }

    if (meetings.length) {
      $.export("$summary", `Successfully retrieved ${meetings.length} meetings`);
    }

    return meetings;
  },
};
