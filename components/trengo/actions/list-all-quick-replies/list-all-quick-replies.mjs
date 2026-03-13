import app from "../../trengo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "trengo-list-all-quick-replies",
  name: "List All Quick Replies",
  description: "List all quick replies. [See the documentation](https://developers.trengo.com/reference/list-all-quick-replies)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filterType: {
      type: "string",
      label: "Type",
      description: "Filter by type of quick reply",
      optional: true,
      options: constants.FILTER_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.app.listQuickReplies({
      params: {
        type: this.filterType,
      },
    });
    $.export("$summary", "Successfully listed quick replies");
    return response;
  },
};

