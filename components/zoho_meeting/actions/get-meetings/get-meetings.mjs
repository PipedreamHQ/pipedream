import app from "../../zoho_meeting.app.mjs";

export default {
  name: "Get Meetings",
  version: "0.0.1",
  key: "zoho_meeting-get-meetings",
  description: "Get a list of meetings. [See the documentation](https://www.zoho.com/meeting/api-integration/meeting-api/list-of-meeting-api.html)",
  type: "action",
  props: {
    app,
    index: {
      label: "Index",
      description: "The index or position of first meeting to list",
      type: "integer",
      optional: true,
      default: 0,
    },
    count: {
      label: "Count",
      description: "Quantity of meetings to list",
      type: "integer",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.app.getMeetings({
      $,
      params: {
        listtype: "all",
        index: this.index,
        count: this.count,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.session.length} meetings`);
    }

    return response;
  },
};
