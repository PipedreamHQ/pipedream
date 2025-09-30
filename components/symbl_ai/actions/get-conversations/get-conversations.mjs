import symblAIApp from "../../symbl_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "symbl_ai-get-conversations",
  name: "Get Conversations",
  description: "Get a list of all conversations. See the doc [here](https://docs.symbl.ai/docs/conversation-api/all-conversations/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    symblAIApp,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Specifies the limit number of conversations to be returned. Default value is `20`.",
      optional: true,
      min: 0,
      max: 65536,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Specifies the number of items to skip before applying `limit`",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Specifies the order in which the results should be sorted based on the start time.",
      options: Object.values(constants.resultsOrder),
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Specifies the start of the date and time range for the results to be returned. Values accepted are [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted strings.",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "Specifies the end of the date and time range for the results to be returned. Values accepted are [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted strings.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Specifies the field to be used to sort the results. Default value is `conversation.startTime`.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Specifies a filter string in RSQL format to filter the results. Default value is `conversation.startDate <= {currentTimestamp - 7 days}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { conversations } = await this.symblAIApp.getConversations({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
        order: this.order,
        startTime: this.startTime,
        endTime: this.endTime,
        sort: this.sort,
        filter: this.filter,
      },
    });
    $.export("$summary", `Successfully retrieved ${conversations.length} conversations`);
    return conversations;
  },
};
