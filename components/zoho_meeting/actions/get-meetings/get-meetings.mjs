import app from "../../zoho_meeting.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Get Meetings",
  version: "0.0.1",
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
      description: "Quantity of meetings to list. Default `all`",
      type: "string",
      optional: true,
      default: constants[0],
      options: constants.LIST_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.app.getMeetings({
      $,
      params: {
        listtype: this.listType,
        count: this.count,
      },
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.session.length} meetings`);
    }

    return response;
  },
};
